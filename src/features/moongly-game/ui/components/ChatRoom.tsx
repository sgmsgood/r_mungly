import { useEffect, useRef } from 'react';
import { CHARACTER_CATALOG } from '../../data/characters';
import { useChatController } from '../../hooks/useChatController';
import type { ChatMessage } from '../../model/chatTypes';
import { useGameStore } from '../../model/gameStore';
import './ChatRoom.css';

export function ChatRoom() {
  const currentCharacter = useGameStore((s) => s.currentCharacter);
  const closeChatRoom = useGameStore((s) => s.closeChatRoom);
  const character = CHARACTER_CATALOG[currentCharacter.character];
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const {
    choices,
    draft,
    inputPlaceholder,
    messages,
    selectedIndex,
    setDraft,
    submitDraft,
    chooseOptionAtIndex,
    undoToMessage,
    undoableMessageIds,
  } = useChatController();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

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

        {choices ? (
          <ChatChoiceGrid
            choices={choices}
            selectedIndex={selectedIndex}
            onChoose={chooseOptionAtIndex}
          />
        ) : null}

        <div ref={bottomRef} />
      </div>

      {inputPlaceholder ? (
        <ChatComposer
          draft={draft}
          placeholder={inputPlaceholder}
          onDraftChange={setDraft}
          onSubmit={submitDraft}
        />
      ) : null}
    </section>
  );
}

function ChatChoiceGrid({
  choices,
  selectedIndex,
  onChoose,
}: {
  choices: string[];
  selectedIndex: number;
  onChoose: (index: number) => void;
}) {
  return (
    <div className="chat-choice-grid" aria-label="대화 선택지">
      {choices.map((choice, index) => (
        <button
          key={choice}
          type="button"
          className={`chat-choice ${selectedIndex === index ? 'selected' : ''}`}
          onClick={() => onChoose(index)}
        >
          {choice}
        </button>
      ))}
    </div>
  );
}

function ChatComposer({
  draft,
  placeholder,
  onDraftChange,
  onSubmit,
}: {
  draft: string;
  placeholder: string;
  onDraftChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="chat-composer" aria-label="직접 입력">
      <input
        value={draft}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(event) => onDraftChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onSubmit();
        }}
      />
      <button type="button" onClick={onSubmit}>전송</button>
    </div>
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

