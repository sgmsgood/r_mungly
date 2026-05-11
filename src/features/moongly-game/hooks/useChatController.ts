import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { INITIAL_MESSAGE, getStepConfig } from '../model/chatFlow';
import type { ChatContext, ChatMessage, ChatStepId, StepResult } from '../model/chatTypes';
import { useGameStore } from '../model/gameStore';

type ChatSnapshot = {
  userMessageId: number;
  messages: ChatMessage[];
  stepId: ChatStepId;
  context: ChatContext;
  draft: string;
};

let nextMessageId = 0;

export function useChatController() {
  const selectedIndex = useGameStore((s) => s.selectedIndex);
  const chatSelectToken = useGameStore((s) => s.chatSelectToken);
  const setChatChoiceCount = useGameStore((s) => s.setChatChoiceCount);
  const pickItem = useGameStore((s) => s.pickItem);
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
  const choices = useMemo(
    () => step.options?.map((option) => option.label) ?? null,
    [step.options],
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

  const chooseOptionAtIndex = useCallback((index: number) => {
    const option = step.options?.[index];
    if (!option) return;
    pickItem(index);
    applyResult(option.label, option.next(context));
  }, [applyResult, context, pickItem, step.options]);

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
    setChatChoiceCount(step.options?.length ?? 0);
  }, [setChatChoiceCount, step.options?.length]);

  useEffect(() => {
    if (chatSelectToken === lastHandledSelectTokenRef.current) return;
    lastHandledSelectTokenRef.current = chatSelectToken;
    const timerId = window.setTimeout(() => chooseOptionAtIndex(selectedIndex), 0);
    return () => window.clearTimeout(timerId);
  }, [chatSelectToken, chooseOptionAtIndex, selectedIndex]);

  const submitDraft = () => {
    const value = draft.trim();
    if (!step.input || !value) return;
    setDraft('');
    applyResult(value, step.input.onSubmit(value, context));
  };

  return {
    choices,
    draft,
    inputPlaceholder: step.input?.placeholder ?? null,
    messages,
    selectedIndex,
    setDraft,
    submitDraft,
    chooseOptionAtIndex,
    undoToMessage,
    undoableMessageIds,
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

