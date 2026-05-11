import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CHARACTER_CATALOG } from '../../data/characters';
import { useGameStore } from '../../model/gameStore';
import './ChatRoom.css';

type ChatMessage = {
  id: number;
  sender: 'moongly' | 'user';
  text: string;
  timeLabel: string;
};

type ChatSnapshot = {
  userMessageId: number;
  messages: ChatMessage[];
  stepId: ChatStepId;
  context: ChatContext;
  draft: string;
};

type ChatStepId =
  | 'start'
  | 'resistedFood'
  | 'resistedReason'
  | 'resistedReasonInput'
  | 'resistedTactic'
  | 'resistedDifficulty'
  | 'resistedSave'
  | 'overateFeeling'
  | 'overateMoment'
  | 'overateAfterFeeling'
  | 'overateSave'
  | 'riskSituation'
  | 'riskCheckTime'
  | 'riskCheckIn'
  | 'riskPause'
  | 'freeLogMoment'
  | 'freeLogMood'
  | 'freeLogSave'
  | 'saved'
  | 'continueChat';

type ChatContext = {
  route?: 'resisted' | 'overate' | 'risk' | 'freeLog';
  wantedFood?: string;
  resistedReason?: string;
  resistedTactic?: string;
  resistedDifficulty?: string;
  overateFeeling?: string;
  overateMoment?: string;
  overateAfterFeeling?: string;
  riskSituation?: string;
  checkTime?: string;
  riskStatus?: string;
  riskPause?: string;
  freeLogMoment?: string;
  freeLogMood?: string;
};

type StepConfig = {
  input?: {
    placeholder: string;
    onSubmit: (value: string, context: ChatContext) => StepResult;
  };
  options?: ChatOption[];
};

type ChatOption = {
  label: string;
  next: (context: ChatContext) => StepResult;
};

type StepResult = {
  nextStep: ChatStepId;
  botText?: string;
  context?: ChatContext;
  reset?: boolean;
};

const INITIAL_MESSAGE = '안녕! 오늘은 어떤 일이 있었어?';
const SAVE_LABEL = '오늘 기록 저장';

let nextMessageId = 0;

export function ChatRoom() {
  const currentCharacter = useGameStore((s) => s.currentCharacter);
  const selectedIndex = useGameStore((s) => s.selectedIndex);
  const chatSelectToken = useGameStore((s) => s.chatSelectToken);
  const setChatChoiceCount = useGameStore((s) => s.setChatChoiceCount);
  const pickItem = useGameStore((s) => s.pickItem);
  const closeChatRoom = useGameStore((s) => s.closeChatRoom);
  const character = CHARACTER_CATALOG[currentCharacter.character];
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastHandledSelectTokenRef = useRef(chatSelectToken);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createMessage('moongly', INITIAL_MESSAGE),
  ]);
  const [stepId, setStepId] = useState<ChatStepId>('start');
  const [context, setContext] = useState<ChatContext>({});
  const [draft, setDraft] = useState('');
  const [history, setHistory] = useState<ChatSnapshot[]>([]);

  const step = useMemo(
    () => getStepConfig(stepId, context),
    [context, stepId],
  );
  const undoableMessageIds = useMemo(
    () => new Set(history.map((snapshot) => snapshot.userMessageId)),
    [history],
  );

  const applyResult = useCallback((userText: string, result: StepResult) => {
    const userMessage = createMessage('user', userText);
    setHistory((currentHistory) => [
      ...currentHistory,
      {
        userMessageId: userMessage.id,
        messages,
        stepId,
        context,
        draft,
      },
    ]);

    if (result.reset) {
      setMessages([
        userMessage,
        createMessage('moongly', result.botText ?? INITIAL_MESSAGE),
      ]);
      setContext({});
      setStepId(result.nextStep);
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      ...(result.botText ? [createMessage('moongly', result.botText)] : []),
    ]);
    setContext((currentContext) => ({
      ...currentContext,
      ...result.context,
    }));
    setStepId(result.nextStep);
  }, [context, draft, messages, stepId]);

  const chooseOption = useCallback((option: ChatOption) => {
    applyResult(option.label, option.next(context));
  }, [applyResult, context]);

  const undoToMessage = useCallback((userMessageId: number) => {
    const snapshotIndex = history.findIndex((snapshot) => (
      snapshot.userMessageId === userMessageId
    ));
    if (snapshotIndex < 0) return;

    const snapshot = history[snapshotIndex];
    setMessages(snapshot.messages);
    setStepId(snapshot.stepId);
    setContext(snapshot.context);
    setDraft(snapshot.draft);
    setHistory((currentHistory) => currentHistory.slice(0, snapshotIndex));
  }, [history]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, stepId]);

  useEffect(() => {
    setChatChoiceCount(step.options?.length ?? 0);
  }, [setChatChoiceCount, step.options?.length]);

  useEffect(() => {
    if (chatSelectToken === lastHandledSelectTokenRef.current) return;
    lastHandledSelectTokenRef.current = chatSelectToken;
    const selectedOption = step.options?.[selectedIndex];
    if (!selectedOption) return;
    const timerId = window.setTimeout(() => chooseOption(selectedOption), 0);
    return () => window.clearTimeout(timerId);
  }, [chatSelectToken, chooseOption, selectedIndex, step.options]);

  const submitDraft = () => {
    const value = draft.trim();
    if (!step.input || !value) return;
    setDraft('');
    applyResult(value, step.input.onSubmit(value, context));
  };

  return (
    <section className="chat-room" aria-label={`${currentCharacter.name}와 대화하기`}>
      <header className="chat-header">
        <button
          className="chat-back"
          type="button"
          aria-label="돌아가기"
          onClick={closeChatRoom}
        >
          ‹
        </button>
        <strong>{currentCharacter.name}와 대화하기</strong>
        <span className="chat-leaf" aria-label="새싹 125">🌱 125</span>
      </header>

      <div className="chat-log">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            characterName={currentCharacter.name}
            characterImage={character.images.basic}
            canUndo={undoableMessageIds.has(message.id)}
            onUndo={() => undoToMessage(message.id)}
          />
        ))}

        {step.options ? (
          <div className="chat-choice-grid" aria-label="대화 선택지">
            {step.options.map((option, index) => (
              <button
                key={option.label}
                type="button"
                className={`chat-choice ${selectedIndex === index ? 'selected' : ''}`}
                onClick={() => {
                  pickItem(index);
                  chooseOption(option);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>

      {step.input ? (
        <div className="chat-composer" aria-label="직접 입력">
          <input
            value={draft}
            placeholder={step.input.placeholder}
            aria-label={step.input.placeholder}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitDraft();
            }}
          />
          <button type="button" onClick={submitDraft}>전송</button>
        </div>
      ) : null}
    </section>
  );
}

function ChatBubble({
  message,
  characterName,
  characterImage,
  canUndo,
  onUndo,
}: {
  message: ChatMessage;
  characterName: string;
  characterImage: string;
  canUndo: boolean;
  onUndo: () => void;
}) {
  if (message.sender === 'user') {
    return (
      <div className="chat-row chat-row-user">
        <div className="chat-meta chat-meta-user">
          {canUndo ? (
            <button
              className="chat-undo"
              type="button"
              aria-label="이 답변 되돌리기"
              onClick={onUndo}
            >
              ↺
            </button>
          ) : null}
          <span className="chat-time">{message.timeLabel}</span>
        </div>
        <div className="chat-bubble chat-bubble-user">{message.text}</div>
      </div>
    );
  }

  return (
    <div className="chat-row chat-row-moongly">
      <img
        src={characterImage}
        className="chat-avatar"
        alt={characterName}
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="chat-bubble chat-bubble-moongly">{message.text}</div>
      <div className="chat-meta">
        <span className="chat-time">{message.timeLabel}</span>
      </div>
    </div>
  );
}

function getStepConfig(stepId: ChatStepId, context: ChatContext): StepConfig {
  if (stepId === 'start') {
    return {
      options: [
        {
          label: '먹고 싶은 걸 참았어',
          next: () => ({
            nextStep: 'resistedFood',
            botText: '와 대단한데? 👏\n뭐가 먹고 싶었어?',
            context: { route: 'resisted' },
          }),
        },
        {
          label: '과식했어',
          next: () => ({
            nextStep: 'overateFeeling',
            botText: '괜찮아.\n오늘 어떤 느낌이었어?',
            context: { route: 'overate' },
          }),
        },
        {
          label: '과식할 것 같아',
          next: () => ({
            nextStep: 'riskSituation',
            botText: '오 미리 눈치챈 거 좋다 👀\n오늘 어떤 상황이야?',
            context: { route: 'risk' },
          }),
        },
        {
          label: '그냥 기록할래',
          next: () => ({
            nextStep: 'freeLogMoment',
            botText: '오늘 어떤 순간이 기억나?',
            context: { route: 'freeLog' },
          }),
        },
      ],
    };
  }

  if (stepId === 'resistedFood') {
    return {
      input: {
        placeholder: '먹고 싶었던 걸 적어줘',
        onSubmit: (value) => ({
          nextStep: 'resistedReason',
          botText: `${getFoodEmpathy(value)}\n왜 특히 먹고 싶어졌던 것 같아?`,
          context: { wantedFood: value },
        }),
      },
    };
  }

  if (stepId === 'resistedReason') {
    return {
      options: [
        resistedReasonOption('신메뉴가 보여서'),
        resistedReasonOption('스트레스 받아서'),
        resistedReasonOption('배고파서'),
        {
          label: '다른 이유',
          next: () => ({
            nextStep: 'resistedReasonInput',
            botText: '어떤 이유였는지 짧게 적어줘.',
          }),
        },
      ],
    };
  }

  if (stepId === 'resistedReasonInput') {
    return {
      input: {
        placeholder: '왜 먹고 싶어졌어?',
        onSubmit: (value) => toResistedTacticStep(value),
      },
    };
  }

  if (stepId === 'resistedTactic') {
    return {
      options: [
        resistedTacticOption('물 마셨어'),
        resistedTacticOption('10분 기다렸어'),
        resistedTacticOption('이미 먹을 게 있었어'),
        resistedTacticOption('그냥 나왔어'),
      ],
    };
  }

  if (stepId === 'resistedDifficulty') {
    return {
      options: [
        resistedDifficultyOption('🙂 괜찮았어', context),
        resistedDifficultyOption('😐 조금 힘들었어', context),
        resistedDifficultyOption('😣 꽤 힘들었어', context),
        resistedDifficultyOption('😭 진짜 힘들었어', context),
      ],
    };
  }

  if (stepId === 'resistedSave') {
    return saveOptions(context);
  }

  if (stepId === 'overateFeeling') {
    return {
      input: {
        placeholder: '오늘 어떤 느낌이었어?',
        onSubmit: (value) => ({
          nextStep: 'overateMoment',
          botText: `${getOveratePatternText(value)}\n언제부터 멈추기 어려워졌어?`,
          context: { overateFeeling: value },
        }),
      },
    };
  }

  if (stepId === 'overateMoment') {
    return {
      options: [
        overateMomentOption('첫 입부터'),
        overateMomentOption('배부른데도 계속'),
        overateMomentOption('디저트 먹으면서'),
        overateMomentOption('이미 망했다고 느껴서'),
      ],
    };
  }

  if (stepId === 'overateAfterFeeling') {
    return {
      options: [
        overateAfterFeelingOption('죄책감 들어', context),
        overateAfterFeelingOption('졸려', context),
        overateAfterFeelingOption('아직 더 먹고 싶어', context),
        overateAfterFeelingOption('그냥 괜찮아', context),
      ],
    };
  }

  if (stepId === 'overateSave') {
    return saveOptions(context);
  }

  if (stepId === 'riskSituation') {
    return {
      input: {
        placeholder: '어떤 상황인지 적어줘',
        onSubmit: (value) => ({
          nextStep: 'riskCheckTime',
          botText: `${getRiskEmpathy(value)}\n중간에 한번 같이 체크해볼까?`,
          context: { riskSituation: value },
        }),
      },
    };
  }

  if (stepId === 'riskCheckTime') {
    return {
      options: [
        riskCheckOption('20분 뒤 체크'),
        riskCheckOption('30분 뒤 체크'),
        {
          label: '안 해도 괜찮아',
          next: () => ({
            nextStep: 'saved',
            botText: '좋아. 그래도 미리 알아차린 것만으로도 충분히 좋은 신호야 🍊',
            context: { checkTime: '안 해도 괜찮아' },
          }),
        },
      ],
    };
  }

  if (stepId === 'riskCheckIn') {
    return {
      options: [
        riskStatusOption('아직 배고파'),
        riskStatusOption('슬슬 배불러'),
        riskStatusOption('사실 충분해'),
        riskStatusOption('그냥 더 먹고 싶어'),
      ],
    };
  }

  if (stepId === 'riskPause') {
    return {
      options: [
        riskPauseOption('물 한잔 마시기'),
        riskPauseOption('젓가락 내려놓기'),
        riskPauseOption('2분 쉬기'),
        riskPauseOption('계속 먹을래'),
      ],
    };
  }

  if (stepId === 'freeLogMoment') {
    return {
      input: {
        placeholder: '기억나는 순간을 적어줘',
        onSubmit: (value) => ({
          nextStep: 'freeLogMood',
          botText: '그때 어떤 기분이었어?',
          context: { freeLogMoment: value },
        }),
      },
    };
  }

  if (stepId === 'freeLogMood') {
    return {
      options: [
        freeLogMoodOption('심심했어', context),
        freeLogMoodOption('스트레스 받았어', context),
        freeLogMoodOption('허전했어', context),
        freeLogMoodOption('그냥 입이 심심했어', context),
      ],
    };
  }

  if (stepId === 'freeLogSave') {
    return saveOptions(context);
  }

  if (stepId === 'saved') {
    return {
      options: [
        {
          label: '새 대화 나누기',
          next: () => ({
            nextStep: 'start',
            botText: INITIAL_MESSAGE,
            reset: true,
          }),
        },
        {
          label: '대화 이어가기',
          next: () => ({
            nextStep: 'continueChat',
            botText: '좋아. 더 남기고 싶은 순간이 있어?',
          }),
        },
      ],
    };
  }

  if (stepId === 'continueChat') {
    return {
      input: {
        placeholder: '더 남기고 싶은 이야기를 적어줘',
        onSubmit: (value) => ({
          nextStep: 'saved',
          botText: `좋아, 이것도 같이 기억해둘게.\n“${value}”`,
        }),
      },
    };
  }

  return {};
}

function resistedReasonOption(label: string): ChatOption {
  return {
    label,
    next: () => toResistedTacticStep(label),
  };
}

function toResistedTacticStep(reason: string): StepResult {
  return {
    nextStep: 'resistedTactic',
    botText: `아 “${getReasonPattern(reason)}” 패턴이네!\n그때 어떻게 넘겼어?`,
    context: { resistedReason: reason },
  };
}

function resistedTacticOption(label: string): ChatOption {
  return {
    label,
    next: () => ({
      nextStep: 'resistedDifficulty',
      botText: `오… ${getTacticInsight(label)}가 도움이 됐구나 🍞\n얼마나 힘들었어?`,
      context: { resistedTactic: label },
    }),
  };
}

function resistedDifficultyOption(label: string, context: ChatContext): ChatOption {
  return {
    label,
    next: () => ({
      nextStep: 'resistedSave',
      botText: `기록해둘게!\nElen님은 “${getResistedSummary(context)}” 상황에서 흔들리기 쉽지만,\n“${context.resistedTactic ?? '넘기는 행동'}”이 꽤 잘 통하고 있어 🍊`,
      context: { resistedDifficulty: label },
    }),
  };
}

function overateMomentOption(label: string): ChatOption {
  return {
    label,
    next: () => ({
      nextStep: 'overateAfterFeeling',
      botText: `${getOverateMomentInsight(label)}\n먹고 난 뒤 기분은 어때?`,
      context: { overateMoment: label },
    }),
  };
}

function overateAfterFeelingOption(label: string, context: ChatContext): ChatOption {
  return {
    label,
    next: () => ({
      nextStep: 'overateSave',
      botText: getOverateFinalText(label, context),
      context: { overateAfterFeeling: label },
    }),
  };
}

function riskCheckOption(label: string): ChatOption {
  return {
    label,
    next: () => ({
      nextStep: 'riskCheckIn',
      botText: `좋아!\n먹는 도중에 한번 배부름 상태를 같이 확인해보자 🚦\n\n${label.replace(' 뒤 체크', '')} 뒤 푸시\n잘 먹고 있어? 🍴\n지금 어느 정도 상태야?`,
      context: { checkTime: label },
    }),
  };
}

function riskStatusOption(label: string): ChatOption {
  return {
    label,
    next: () => ({
      nextStep: 'riskPause',
      botText: `${getRiskStatusText(label)}\n잠깐만 쉬어갈래?`,
      context: { riskStatus: label },
    }),
  };
}

function riskPauseOption(label: string): ChatOption {
  return {
    label,
    next: () => ({
      nextStep: 'saved',
      botText: getRiskPauseText(label),
      context: { riskPause: label },
    }),
  };
}

function freeLogMoodOption(label: string, context: ChatContext): ChatOption {
  return {
    label,
    next: () => ({
      nextStep: 'freeLogSave',
      botText: `${getFreeLogMoodText(label, context)}\n기록해둘게.`,
      context: { freeLogMood: label },
    }),
  };
}

function saveOptions(context: ChatContext): StepConfig {
  return {
    options: [
      {
        label: SAVE_LABEL,
        next: () => ({
          nextStep: 'saved',
          botText: getSavedReport(context),
        }),
      },
    ],
  };
}

function createMessage(sender: ChatMessage['sender'], text: string): ChatMessage {
  nextMessageId += 1;
  return {
    id: nextMessageId,
    sender,
    text,
    timeLabel: getCurrentTimeLabel(),
  };
}

function getCurrentTimeLabel() {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date());
}

function getFoodEmpathy(food: string) {
  if (food.includes('빵') || food.includes('샌드위치') || food.includes('베이커리')) {
    return '헉… 빵집 들어가면 진짜 힘들지 👀';
  }
  return `${food} 생각났으면 진짜 흔들릴 만했겠다 👀`;
}

function getReasonPattern(reason: string) {
  if (reason.includes('신메뉴')) return '새로운 메뉴 많이 보임';
  if (reason.includes('냄새')) return '냄새 자극';
  if (reason.includes('배고파')) return '공복 자극';
  if (reason.includes('스트레스')) return '스트레스 보상';
  return reason;
}

function getTacticInsight(tactic: string) {
  if (tactic.includes('물')) return '물 마시기';
  if (tactic.includes('10분')) return '10분 기다리기';
  if (tactic.includes('이미')) return '이미 준비된 음식 떠올리기';
  return '그 자리에서 벗어나기';
}

function getResistedSummary(context: ChatContext) {
  const food = context.wantedFood?.includes('빵') || context.wantedFood?.includes('샌드위치')
    ? '빵집'
    : context.wantedFood ?? '먹고 싶은 음식';
  const reason = context.resistedReason ? getReasonPattern(context.resistedReason) : '갑작스러운 식욕';
  return `${food} + ${reason}`;
}

function getOveratePatternText(value: string) {
  if (includesAny(value, ['짜증', '화나', '화가', '스트레스', '열받', '힘들', '우울'])) {
    return '아… 감정이 많이 올라온 날이었구나 👀';
  }
  if (includesAny(value, ['음식', '메뉴', '종류', '뷔페', '반찬']) && includesAny(value, ['많', '여러', '다양'])) {
    return '아… “먹을 게 많이 보임”이 꽤 강한 상황이었구나 👀';
  }
  if (includesAny(value, ['계속', '멈추', '손이', '자꾸'])) {
    return '아… 멈추는 타이밍을 잡기가 어려웠던 날 같아 👀';
  }
  return '아… 오늘은 멈추는 타이밍을 잡기 어려웠던 날 같아 👀';
}

function includesAny(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

function getOverateMomentInsight(moment: string) {
  if (moment === '배부른데도 계속') {
    return '그럼 배고픔보다는 “더 먹고 싶은 마음”이 컸을 수도 있겠다.';
  }
  if (moment === '이미 망했다고 느껴서') {
    return '그 마음 들면 멈추기가 더 어려워질 수 있어. 그래도 오늘은 기록으로 돌아온 거야.';
  }
  return '그 순간부터 속도가 조금 빨라졌을 수 있겠다.';
}

function getOverateFinalText(feeling: string, context: ChatContext) {
  if (feeling === '죄책감 들어') {
    return `오늘은 “${context.overateFeeling ?? '좋아하는 음식 많음'} + 만족감 안 옴” 조합이 강했던 날 같아.\n다음엔 처음부터 메뉴 수를 줄이는 게 도움이 될 수도 있어 🍽️`;
  }
  return `오늘은 “${context.overateMoment ?? '멈추기 어려운 순간'}”을 알아차린 날로 기록해둘게.\n한 번 먹었다고 끝난 건 아니야.`;
}

function getRiskEmpathy(value: string) {
  if (value.includes('곱창') || value.includes('친구') || value.includes('약속')) {
    return '와… 그건 쉽지 않은 조합인데 😂';
  }
  return '그 상황이면 미리 대비해두는 게 좋겠다 👀';
}

function getRiskStatusText(status: string) {
  if (status === '그냥 더 먹고 싶어') {
    return '오… 지금은 배고픔보다 “계속 먹고 싶은 마음”이 조금 더 큰 상태 같아 👀';
  }
  if (status === '사실 충분해') {
    return '좋아. 이미 충분하다는 신호를 알아차린 게 꽤 커 👀';
  }
  return '좋아. 지금 상태를 한 번 말로 꺼낸 것만으로도 속도를 늦출 수 있어 👀';
}

function getRiskPauseText(pause: string) {
  if (pause === '계속 먹을래') {
    return '괜찮아. 먹더라도 지금 상태를 알아차린 기록은 남겨둘게 🍊';
  }
  if (pause === '2분 쉬기') {
    return '좋아.\n천천히 먹어도 음식은 안 도망가 🍊';
  }
  return `좋아. ${pause}부터 해보자.\n잠깐 쉬어가도 괜찮아 🍊`;
}

function getFreeLogMoodText(mood: string, context: ChatContext) {
  if (mood === '허전했어') {
    return '음… 오늘은 배고픔보다 감정 허기가 조금 컸을 수도 있겠다 🌙';
  }
  return `오늘은 “${mood}” 마음이 ${context.freeLogMoment ?? '그 순간'}에 영향을 줬을 수도 있겠다.`;
}

function getSavedReport(context: ChatContext) {
  if (context.route === 'resisted') {
    return `저장했어 🍊\n최근 패턴\n- ${getResistedSummary(context)} 상황에서 흔들림\n- “${context.resistedTactic ?? '넘기는 행동'}” 사용\n- 힘든 정도: ${context.resistedDifficulty ?? '기록됨'}`;
  }

  if (context.route === 'overate') {
    return `저장했어 🍊\n최근 패턴\n- 종류 많은 음식에서 과식 위험 증가\n- 멈추기 어려운 순간: ${context.overateMoment ?? '기록됨'}\n- 먹은 뒤 감정: ${context.overateAfterFeeling ?? '기록됨'}`;
  }

  if (context.route === 'freeLog') {
    return `저장했어 🍊\n최근 패턴\n- ${context.freeLogMood ?? '감정'} 상태에서 식욕 신호 증가\n- 기억난 순간: ${context.freeLogMoment ?? '기록됨'}`;
  }

  return '저장했어 🍊\n오늘은 미리 알아차린 것 자체가 좋은 기록이야.';
}
