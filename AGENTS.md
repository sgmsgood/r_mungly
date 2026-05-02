# AGENTS.md

## 0. How to Use This File

- 이 문서는 뭉글리(Moongly) 프로젝트 작업 시 반드시 따라야 하는 기준이다.
- 모든 답변, 코드 수정, 기능 제안은 아래 기준을 우선한다.
- 충돌이 있을 경우 우선순위는 다음과 같다.

Priority:
1. Product Principles
2. MVP Scope
3. Character State Rules
4. Development Principles
5. Design Principles
6. Agent Roles

---

## 1. Product Context

### 1.1 App Summary

뭉글리(Moongly)는 다이어트 중 갑자기 찾아오는 식욕을 귀여운 가상 펫과 함께 넘기도록 돕는 앱이다.

사용자가 먹고 싶은 음식을 입력하면, 앱은 바로 “먹을래?”를 묻지 않고 “뭉글리에게 먼저 먹이기” 또는 “10분만 참아보기”를 제공한다.

이후 30분 뒤 “잘 참았어?” 푸시를 통해 실제 결과를 확인하고, 사용자는 “참았어 / 먹었어”로 기록한다.

### 1.2 Core Loop

1. 사용자가 먹고 싶은 음식을 입력한다.
2. 앱은 바로 “먹을래?”를 묻지 않는다.
3. 사용자는 “뭉글리에게 먼저 먹이기” 또는 “10분만 참아보기” 중 하나를 선택한다.
4. 앱은 캐릭터 연출 또는 타이머로 욕구를 한 번 넘기게 돕는다.
5. 30분 뒤 “잘 참았어?” 푸시를 보낸다.
6. 사용자는 “참았어 / 먹었어”로 결과를 기록한다.
7. 참았으면 `proud`, 먹었으면 `comfort` 상태로 피드백한다.

### 1.3 Product Positioning

- 뭉글리는 사용자를 혼내는 다이어트 앱이 아니다.
- 뭉글리는 식욕을 억압하는 앱이 아니라, 식욕을 인정하고 한 번 넘기게 돕는 앱이다.
- 핵심은 “먹기 전 개입 → 지연 → 결과 기록 → 감정 복귀”다.
- 사용자가 먹었더라도 실패로 몰아가지 않고, 다시 돌아오게 만드는 경험을 제공한다.

---

## 2. MVP Scope

### 2.1 Must Have

- 먹고 싶은 음식 입력
- “뭉글리에게 먼저 먹이기” 선택
- “10분만 참아보기” 선택
- 10분 타이머
- 30분 뒤 “잘 참았어?” 푸시
- 결과 기록: `참았어 / 먹었어`
- 캐릭터 상태 변화

Required character states:
- `idle`
- `craving`
- `thinking`
- `anticipatingFood`
- `eating`
- `satisfied`
- `resisting`
- `proud`
- `comfort`

### 2.2 Should Have

- 식욕 기록 히스토리
- 참았어/먹었어 결과 통계
- 음식별 기록
- 시간대별 식욕 패턴
- 최근 입력한 음식 재선택

### 2.3 Later

- 캐릭터 레벨업
- 캐릭터 커스터마이징
- 소셜 공유
- 광고/수익화
- AI 코칭
- 음식 이미지 인식
- 칼로리 계산
- 상세 리포트
- 친구/커뮤니티 기능

### 2.4 Do Not Build in MVP

- 복잡한 칼로리 계산
- 과한 리포트/분석 화면
- 커뮤니티 기능
- 처음 선택지에 “그냥 먹을래?” 제공
- 사용자를 혼내는 실패 화면
- 과도한 캐릭터 성장 시스템
- 핵심 루프와 무관한 꾸미기 기능
- MVP 검증 전 과도한 AI 기능

---

## 3. Product Principles

### 3.1 UX Rules

- 처음부터 “먹을래?”를 묻지 않는다.
- 첫 선택지는 아래 두 개로 제한한다.
  - “뭉글리에게 먼저 먹이기”
  - “10분만 참아보기”
- “먹었어”는 실패가 아니다.
- 먹었을 때는 `comfort` 상태로 복귀를 돕는다.
- 참았을 때는 `proud` 상태로 긍정 피드백을 준다.
- 사용자의 죄책감을 강화하는 문구를 쓰지 않는다.
- 식욕 입력 직후에는 판단보다 전환 행동을 먼저 제공한다.
- 사용자가 다시 앱으로 돌아오게 만드는 부드러운 흐름을 우선한다.

### 3.2 Copy Tone

Use:
- “괜찮아, 다시 돌아오면 돼.”
- “한 번 먹었다고 끝난 건 아니야.”
- “지금 한 번 넘겨보자.”
- “와, 잘 넘겼다.”
- “일단 나한테 먼저 맡겨볼래?”
- “10분만 같이 버텨보자.”

Avoid:
- “실패했어.”
- “왜 먹었어?”
- “참았어야지.”
- “목표 달성 실패.”
- “의지가 부족해.”
- “이러면 안 돼.”

### 3.3 Hypothesis Language

검증되지 않은 내용은 단정하지 않는다.

Use:
- “가정했다”
- “검증할 예정이다”
- “도움이 될 수 있다고 보았다”
- “MVP에서 확인할 지표”
- “가능성이 있다고 판단했다”

Avoid:
- “효과가 있다”
- “충동 섭취를 줄인다”
- “리텐션이 올라간다”
- “사용자가 반드시 계속 쓴다”
- “검증되었다”

### 3.4 Portfolio Writing Rule

포트폴리오 문장에서는 검증 전 내용을 성과처럼 쓰지 않는다.

Good:
- “캐릭터 대리만족과 10분 타이머가 충동 섭취 결정을 지연시키는 데 도움이 될 수 있다고 가정했다.”
- “MVP 출시 후 30분 후 결과 기록률과 재방문율을 통해 검증할 예정이다.”

Bad:
- “캐릭터 대리만족으로 충동 섭취를 줄였다.”
- “위로 메시지로 리텐션을 개선했다.”

---

## 4. Character State Rules

### 4.1 State Type

```ts
type MoonglyCharacterState =
  | 'idle'
  | 'greeting'
  | 'craving'
  | 'thinking'
  | 'anticipatingFood'
  | 'eating'
  | 'satisfied'
  | 'resisting'
  | 'proud'
  | 'comfort'
  | 'full'
  | 'sleepy'
  | 'levelUp';
4.2 State Meaning
idle: 기본 대기 상태
greeting: 앱 진입 시 반김
craving: 사용자가 먹고 싶은 음식을 입력한 상태
thinking: 어떻게 넘길지 선택하는 상태
anticipatingFood: 뭉글리에게 먹이기 직전 기대 상태
eating: 뭉글리가 먹는 중
satisfied: 대리만족 완료
resisting: 10분 타이머 동안 참는 중
proud: 사용자가 잘 넘겼을 때 칭찬
comfort: 사용자가 먹었을 때 죄책감 낮추고 복귀
full: 많이 먹었다고 기록했을 때, 필요 시 사용
sleepy: 밤/오래 방치 상태
levelUp: 성장/보상 상태
4.3 Main Flow
idle → craving → thinking
4.4 Choice Flow
뭉글리에게 먼저 먹이기:
thinking → anticipatingFood → eating → satisfied → idle

10분만 참아보기:
thinking → resisting → idle
4.5 Follow-up Flow
30분 뒤 푸시: "잘 참았어?"

참았어:
proud → idle

먹었어:
comfort → idle
4.6 Optional Extended Flow

추후 “조금 먹었어 / 많이 먹었어”로 세분화할 경우에만 사용한다.

조금 먹었어:
satisfied → idle

많이 먹었어:
full → comfort → idle
4.7 State Design Rule
상태는 사용자 행동과 연결되어야 한다.
상태는 캐릭터 표정/동작으로 표현 가능해야 한다.
상태가 많아져도 MVP에서는 필요한 상태만 우선 구현한다.
단순히 귀여운 연출을 위해 불필요한 상태를 늘리지 않는다.
comfort는 실패 상태가 아니라 복귀 상태다.
proud는 사용자를 칭찬하는 상태다.
resisting은 먹는 연출이 없는 타이머 상태다.
5. Development Principles
5.1 Tech Stack Assumption
React
TypeScript
Zustand for local UI/client state
TanStack Query for server state
Zod for validation
Supabase if persistence/auth is needed
5.2 State Management Rule
UI에서만 쓰는 일시적 상태는 local state 또는 Zustand를 사용한다.
서버에서 가져오거나 저장해야 하는 데이터는 TanStack Query를 사용한다.
사용자 기록, 식욕 히스토리, 결과 기록처럼 영속성이 필요한 데이터는 Supabase 저장을 고려한다.
캐릭터 현재 상태는 클라이언트 상태로 관리할 수 있다.
식욕 입력 기록과 결과 기록은 서버/DB 저장 대상으로 본다.
상태 전이 로직은 여러 컴포넌트에 흩뿌리지 않는다.
5.3 Component Rules
컴포넌트는 재사용 가능성을 고려해 설계한다.
중복 UI는 지양한다.
반복되는 UI는 공통 컴포넌트로 분리한다.
반복되는 상태/이벤트 로직은 커스텀 훅으로 분리한다.
반복되는 계산/변환 로직은 유틸 함수로 분리한다.
도메인 컴포넌트와 공통 UI 컴포넌트를 구분한다.
props 기반으로 변형 가능한 구조를 우선한다.
단, MVP에서는 과도한 추상화를 피한다.
5.4 Abstraction Rule

다음 중 하나라도 해당하면 분리를 검토한다.

같은 UI가 2회 이상 반복된다.
같은 이벤트 로직이 2회 이상 반복된다.
같은 계산 로직이 2회 이상 반복된다.
상태 전이 로직이 여러 컴포넌트에 흩어진다.
동일한 타입 정의가 여러 파일에 반복된다.
같은 스타일 패턴이 여러 컴포넌트에 반복된다.

단, 다음 경우에는 바로 추상화하지 않는다.

아직 한 번만 사용되는 UI
요구사항이 자주 바뀌고 있는 실험 단계 UI
분리했을 때 오히려 props가 복잡해지는 경우
MVP 속도를 크게 늦추는 경우
5.5 TypeScript Rules
임시 any 사용을 피한다.
enum/string literal은 한 곳에서 관리한다.
상태값은 명확한 union type 또는 enum으로 정의한다.
API 응답, DB row, form input 타입을 구분한다.
Zod schema와 TypeScript type을 가능한 한 연결한다.
nullable 값은 명시적으로 처리한다.
5.6 Avoid
불필요한 전역 상태
임시 any
중복된 enum/string literal
컴포넌트 내부에 긴 비즈니스 로직 작성
UI 컴포넌트와 도메인 로직 강결합
MVP에서 과한 폴더 구조
같은 UI를 복붙해서 여러 곳에 만드는 것
상태 전이 로직을 버튼 onClick 안에 길게 작성하는 것
6. Suggested Project Structure

MVP 기준으로 과하지 않게 시작한다.

src/
  app/
  components/
    common/
    moongly/
  features/
    craving/
    timer/
    character/
    result/
  hooks/
  lib/
  stores/
  types/
  utils/
6.1 Folder Intent
components/common: 버튼, 카드, 모달 등 공통 UI
components/moongly: 뭉글리 캐릭터 UI, 상태별 렌더링
features/craving: 먹고 싶은 음식 입력 및 선택 흐름
features/timer: 10분 참기 타이머
features/character: 캐릭터 상태 전이 로직
features/result: 30분 후 결과 기록
hooks: 재사용 가능한 커스텀 훅
stores: Zustand store
types: 공통 타입
utils: 순수 유틸 함수
lib: 외부 라이브러리 설정, Supabase client 등
7. Design Principles
7.1 Pixel Character Rules
뭉글리는 사용자를 혼내는 캐릭터가 아니다.
뭉글리는 함께 버텨주는 캐릭터다.
상태별 표정과 동작이 명확해야 한다.
MVP에서는 과한 애니메이션보다 상태 구분이 우선이다.
64x64 픽셀 기준으로 표현 가능한 동작을 우선한다.
작은 표정 변화, 흔들림, 타이머, 먹는 연출, 위로 연출을 활용한다.
7.2 State Visual Direction
idle: 기본 대기, 편안한 표정
craving: 사용자의 욕구를 감지한 놀람/공감 표정
thinking: 고민하는 표정, 물음표
anticipatingFood: 눈 반짝, 기대감
eating: 냠냠 먹는 동작
satisfied: 만족, 편안한 미소
resisting: 눈 질끈 감고 참기, 10분 타이머, 고개 좌우 흔들림
proud: 박수, 반짝임, 칭찬
comfort: 토닥임, 부드러운 표정, 하트
full: 배부름, 둥근 배, 과하지 않은 표현
sleepy: 졸림, 눈 감김
levelUp: 반짝임, 성장/축하
7.3 Animation Rules
상태별 애니메이션은 짧고 반복 가능해야 한다.
과도한 움직임보다 귀엽고 명확한 피드백을 우선한다.
resisting 상태는 타이머와 고개 흔들림으로 표현한다.
comfort 상태는 혼내는 느낌 없이 부드럽게 표현한다.
proud 상태는 사용자의 행동을 칭찬하는 연출이어야 한다.
8. Agent Roles
8.1 Senior React Developer

Focus:

React 구조
TypeScript 타입 안정성
상태관리
컴포넌트 재사용성
중복 코드 제거
성능
유지보수성
Supabase 연동
TanStack Query 사용 기준
Zustand 사용 기준
Zod validation

Must Check:

이 상태가 local state인지 server state인지
이 컴포넌트가 재사용 가능한지
중복 코드가 생기지 않는지
커스텀 훅으로 분리할 로직인지
타입이 명확한지
MVP에 과한 구조는 아닌지
상태 전이 로직이 한 곳에서 관리되는지
UI와 도메인 로직이 과하게 섞이지 않았는지
8.2 Senior Product Manager

Focus:

문제 정의
핵심 루프
MVP 범위
사용자 플로우
가설과 검증 지표
리텐션
온보딩
푸시 전략
포트폴리오 설득력

Must Check:

이 기능이 핵심 루프에 필요한지
사용자가 왜 이 행동을 해야 하는지
처음 선택지에 “먹을래?”를 넣고 있지 않은지
검증되지 않은 주장을 단정하고 있지 않은지
MVP에서 측정 가능한지
사용자가 먹었을 때 죄책감을 강화하지 않는지
30분 뒤 푸시가 결과 기록으로 자연스럽게 이어지는지
8.3 Pixel Game Designer

Focus:

64x64 픽셀 캐릭터
상태별 감정 표현
귀여움
애니메이션 일관성
캐릭터 피드백
도트 그래픽 가독성
상태별 실루엣 차이

Must Check:

상태가 표정/동작으로 구분 가능한지
캐릭터가 사용자를 혼내는 느낌은 아닌지
resisting, proud, comfort가 시각적으로 명확한지
과한 애니메이션이 MVP에 부담되지 않는지
작은 화면에서도 상태가 이해되는지
캐릭터 일관성이 유지되는지
9. Response Format

모든 설계/기능/코드 제안은 가능한 경우 아래 형식을 따른다.

## 요청 요약

## React Developer 관점

## Product Manager 관점

## Pixel Game Designer 관점

## 충돌 지점 / 주의점

## 최종 합의안

## MVP에서 할 것

## 나중에 할 것

## 하지 말 것

## 바로 실행할 TODO

코드 수정 요청처럼 간단한 작업에서는 아래 축약 형식을 사용해도 된다.

## 판단

## 수정 방향

## 구현

## 주의점
10. Decision Checklist

작업 전 반드시 확인한다.

[ ] 이 기능은 핵심 루프에 필요한가?
[ ] 처음부터 “먹을래?”를 묻고 있지 않은가?
[ ] “먹었어”를 실패로 처리하고 있지 않은가?
[ ] 캐릭터 상태가 사용자 행동과 연결되는가?
[ ] 상태 전이 흐름이 명확한가?
[ ] 중복 UI/로직이 생기지 않는가?
[ ] 재사용 가능한 컴포넌트로 만들 수 있는가?
[ ] MVP에 과한 추상화는 아닌가?
[ ] 검증되지 않은 내용을 단정하고 있지 않은가?
[ ] 사용자를 혼내는 문구가 들어가 있지 않은가?
[ ] 상태값이 중복 string literal로 흩어져 있지 않은가?
[ ] 서버 상태와 클라이언트 상태가 구분되어 있는가?
11. Task Execution Rule

작업을 수행할 때는 다음 순서를 따른다.

요청이 뭉글리 핵심 루프와 관련 있는지 확인한다.
MVP 범위에 포함되는지 확인한다.
사용자에게 죄책감을 주는 UX인지 확인한다.
필요한 캐릭터 상태를 확인한다.
상태 전이 흐름을 먼저 정의한다.
UI 컴포넌트를 설계한다.
중복될 가능성이 있는 UI/로직을 확인한다.
필요한 경우 공통 컴포넌트, 훅, 유틸, 타입으로 분리한다.
구현한다.
마지막에 체크리스트 기준으로 검토한다.
12. Naming Rules
12.1 State Naming
상태명은 캐릭터 감정/행동이 명확히 드러나야 한다.
너무 추상적인 이름은 피한다.
사용자의 행동과 연결되지 않는 상태는 추가하지 않는다.

Preferred:

craving
thinking
anticipatingFood
eating
satisfied
resisting
proud
comfort

Avoid:

happy only
sad only
good
bad
success
fail
12.2 Component Naming
공통 UI는 일반적인 이름을 사용한다.
Button
Card
Modal
Badge
도메인 컴포넌트는 뭉글리 기능이 드러나게 작성한다.
MoonglyCharacter
CravingInput
ChoicePanel
ResistTimer
FollowUpResult
CharacterStateRenderer
12.3 Hook Naming
hook은 use로 시작한다.
도메인 로직이 드러나게 작성한다.

Examples:

useCharacterState
useCravingFlow
useResistTimer
useFollowUpNotification
13. Portfolio Rule

포트폴리오용 설명을 작성할 때는 아래 구조를 우선한다.

Project Overview
Problem
Target User
Design Hypothesis
Core UX Flow
Character State Design
Key Product Decisions
Features
Tech Stack
Learnings & Next Steps
13.1 Portfolio Core Message

뭉글리는 단순한 다이어트 기록 앱이 아니라, 식욕이 발생한 순간 사용자의 행동을 지연·전환·기록하도록 설계한 행동 변화 UX 프로젝트다.

13.2 Portfolio Writing Do
문제 정의를 먼저 쓴다.
검증 전 내용은 가설로 쓴다.
의사결정 이유를 쓴다.
“왜 이 기능을 넣었는지”를 쓴다.
캐릭터 상태 설계를 UX 설계로 설명한다.
13.3 Portfolio Writing Avoid
검증되지 않은 성과를 쓴다.
단순히 “귀여운 다마고치 앱”이라고만 설명한다.
기능 목록만 나열한다.
“충동 섭취를 줄였다”처럼 검증 완료처럼 쓴다.

## Project

This is a React + TypeScript remake of the Flutter app Mungly.

Mungly is a cute pastel pixel-pet game inspired by Tamagotchi. The UI should feel like a small handheld toy device containing a pixel-art pet room.

## Design Direction

- The first screen must be the actual game UI, not a landing page.
- Preserve the core feeling: pastel handheld device, pixel-art room, cute pet character, toy-like buttons.
- Use a soft lavender outer page background.
- The outer device should be rounded, soft, toy-like, and centered.
- The inner game UI should feel more pixel-like: sharp rectangular buttons, small pixel decorations, low-radius or no-radius controls.
- Keep Korean UI labels.
- Prioritize visual fidelity to the original Flutter version.

## Core Layout

- Full page background: `#EDE9FE`.
- Center a vertical handheld device frame.
- Device max size: around `380px` wide and `560px` tall.
- Device aspect ratio: about `0.5`.
- Device body color: `#F5F3FF`.
- Device border radius: around `46px`.
- Device should have a white border and soft lavender shadow.
- Inner screen should be white-framed, padded, and clipped.
- Game screen background: warm cream `#FFF6ED`.
- Bottom physical controls: left button, center button, right button.

## Colors

Use this palette:

```ts
const colors = {
  primary100: '#F5F3FF',
  primary200: '#EDE9FE',
  primary300: '#DDD6FE',
  primary400: '#C4B5FD',
  primary500: '#A78BFA',

  background: '#FAF9FF',
  card: '#FFFFFF',
  soft: '#F8F7FC',

  characterBg: '#FFF6ED',
  characterShadow: '#EADFD6',

  kcalPlus: '#FF7A6B',
  kcalPlusBg: '#FFF1EF',
  kcalMinus: '#4CAF7D',
  kcalMinusBg: '#EAF7F0',

  textPrimary: '#3A3A3A',
  textSecondary: '#8A8A8A',
  textLight: '#B5B5B5',

  accentPink: '#F8B4D9',
  accentYellow: '#FFE58F',
  accentMint: '#B8F2E6',
  accentBlue: '#BFD7FF',
}
