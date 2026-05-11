import type { ChatContext, ChatOption, ChatStepId, StepConfig, StepResult } from './chatTypes';

export const INITIAL_MESSAGE = '안녕! 오늘은 어떤 일이 있었어?';

const SAVE_LABEL = '오늘 기록 저장';

export function getStepConfig(stepId: ChatStepId, context: ChatContext): StepConfig {
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
          label: '배고파',
          next: () => ({
            nextStep: 'freeLogMoment',
            botText: '지금 어떤 배고픔이야?',
            context: { route: 'freeLog' },
          }),
        },
        {
          label: '먹고싶은게 있어',
          next: () => ({
            nextStep: 'cravingInput',
            botText: '좋아, 뭐가 먹고 싶어?',
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
      options: [
        freeLogHungerOption('너무 적게 먹었어'),
        freeLogHungerOption('많이 먹었는데도 배고파'),
        freeLogHungerOption('그냥 먹고싶어'),
        {
          label: '입력하기',
          next: () => ({
            nextStep: 'freeLogInput',
            botText: '지금 먹고 싶은 걸 적어줘.',
          }),
        },
      ],
    };
  }

  if (stepId === 'freeLogInput') {
    return {
      input: {
        placeholder: '지금 먹고 싶은 걸 적어줘',
        onSubmit: (value) => toFreeLogMoodStep(value),
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

  if (stepId === 'cravingInput') {
    return {
      input: {
        placeholder: '먹고 싶은 걸 적어줘',
        onSubmit: (value) => ({
          nextStep: 'cravingAction',
          botText: `${value} 먹고 싶은 마음이 올라왔구나.\n어떻게 할래?`,
          context: {
            freeLogMoment: value,
            wantedFood: value,
          },
        }),
      },
    };
  }

  if (stepId === 'cravingAction') {
    return {
      options: [
        cravingActionOption('10분 참아볼래'),
        cravingActionOption('물 마셔볼래'),
        cravingActionOption('먹으러 갈래'),
        cravingActionOption('모르겠어!!'),
      ],
    };
  }

  if (stepId === 'cravingResistConfirm') {
    return {
      options: [
        {
          label: '참기 모드 진행',
          next: () => ({
            nextStep: 'saved',
            command: 'startResistTimer',
          }),
        },
      ],
    };
  }

  if (stepId === 'cravingUnsure') {
    return {
      options: [
        cravingSuggestionOption('물 마시기'),
        cravingSuggestionOption('산책하기'),
        cravingSuggestionOption('명상하기'),
      ],
    };
  }

  if (stepId === 'cravingSave') {
    return saveOptions(context);
  }

  if (stepId === 'saved') {
    return {
      options: [
        {
          label: '대화 이어가기',
          next: () => ({
            nextStep: 'continueChat',
            botText: '좋아. 더 남기고 싶은 순간이 있어?',
          }),
        },
        {
          label: '여기서 끝내기',
          next: () => ({
            nextStep: 'saved',
            command: 'closeChat',
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
      botText: getResistedMemoryText(context),
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

function freeLogHungerOption(label: string): ChatOption {
  return {
    label,
    next: () => toFreeLogMoodStep(label),
  };
}

function toFreeLogMoodStep(hungerText: string): StepResult {
  return {
    nextStep: 'freeLogMood',
    botText: `${getFreeLogHungerText(hungerText)}\n그때 어떤 기분이었어?`,
    context: { freeLogMoment: hungerText },
  };
}

function freeLogMoodOption(label: string, context: ChatContext): ChatOption {
  return {
    label,
    next: () => ({
      nextStep: 'freeLogSave',
      botText: `${getFreeLogMoodText(label, context)}\n이 마음도 내가 살짝 기억해둘게.`,
      context: { freeLogMood: label },
    }),
  };
}

function cravingActionOption(label: string): ChatOption {
  return {
    label,
    next: () => {
      if (label === '10분 참아볼래') {
        return {
          nextStep: 'cravingResistConfirm',
          botText: '좋아! 같이 참아보자.',
        };
      }
      if (label === '물 마셔볼래') {
        return {
          nextStep: 'cravingSave',
          botText: '좋아. 일단 물 한 잔으로 마음에 작은 쉼표를 찍어보자 🍊',
          context: { resistedTactic: label },
        };
      }
      if (label === '먹으러 갈래') {
        return {
          nextStep: 'cravingSave',
          botText: '그래! 대신 조금만 먹을 수 있겠어?',
          context: { resistedTactic: label },
        };
      }
      return {
        nextStep: 'cravingUnsure',
        botText: '괜찮아. 모를 때는 아주 작은 행동 하나만 골라보자.',
      };
    },
  };
}

function cravingSuggestionOption(label: string): ChatOption {
  return {
    label,
    next: () => ({
      nextStep: 'cravingSave',
      botText: `${label}부터 해보자.\n지금 바로 결론 내리지 않아도 괜찮아.`,
      context: { resistedTactic: label },
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
          botText: getSavedPrompt(context),
        }),
      },
    ],
  };
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

function getResistedMemoryText(context: ChatContext) {
  const food = context.wantedFood ?? '먹고 싶었던 마음';
  const tactic = context.resistedTactic ?? '넘겨본 행동';
  return `좋아, 이 순간 기억해둘게.\n${food} 먹고 싶었던 마음도,\n${tactic}로 넘겨본 것도 같이 남겨둘게 🍊`;
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
    return '괜찮아, 한 번 먹었다고 끝난 건 아니야.\n오늘 돌아와서 말해준 것만으로도 좋아.';
  }
  return `오늘은 ${context.overateMoment ?? '멈추기 어려웠던 순간'}을 알아차린 날로 기억해둘게.\n잘했는지 못했는지보다, 돌아와서 말해준 게 중요해.`;
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

function getFreeLogHungerText(hungerText: string) {
  if (hungerText === '너무 적게 먹었어') {
    return '아, 몸이 에너지를 더 달라고 보내는 신호일 수도 있겠다.';
  }
  if (hungerText === '많이 먹었는데도 배고파') {
    return '그럴 때 있지. 배는 찼는데 마음이 더 찾는 느낌일 수도 있어.';
  }
  if (hungerText === '그냥 먹고싶어') {
    return '응, 꼭 배고파서만 먹고 싶은 건 아니니까 괜찮아.';
  }
  return `${hungerText} 생각이 올라왔구나.`;
}

function getFreeLogMoodText(mood: string, context: ChatContext) {
  if (mood === '허전했어') {
    return '음… 오늘은 배고픔보다 감정 허기가 조금 컸을 수도 있겠다 🌙';
  }
  return `오늘은 “${mood}” 마음이 ${context.freeLogMoment ?? '그 순간'}에 영향을 줬을 수도 있겠다.`;
}

function getSavedPrompt(context: ChatContext) {
  if (context.route === 'risk') {
    return '좋아, 여기까지 같이 봤어.\n이어서 더 얘기할까, 아니면 여기서 마칠까?';
  }
  return '좋아, 여기까지 남겨뒀어.\n이어서 더 얘기할까, 아니면 여기서 마칠까?';
}
