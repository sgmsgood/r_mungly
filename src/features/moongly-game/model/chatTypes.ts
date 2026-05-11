export type ChatMessage = {
  id: number;
  sender: 'moongly' | 'user';
  text: string;
  timeLabel: string;
};

export type ChatStepId =
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
  | 'freeLogInput'
  | 'freeLogMood'
  | 'freeLogSave'
  | 'cravingInput'
  | 'cravingAction'
  | 'cravingResistConfirm'
  | 'cravingUnsure'
  | 'cravingSave'
  | 'saved'
  | 'continueChat';

export type ChatContext = {
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

export type StepConfig = {
  input?: {
    placeholder: string;
    onSubmit: (value: string, context: ChatContext) => StepResult;
  };
  options?: ChatOption[];
};

export type ChatOption = {
  label: string;
  next: (context: ChatContext) => StepResult;
};

export type StepResult = {
  nextStep: ChatStepId;
  botText?: string;
  context?: ChatContext;
  reset?: boolean;
  command?: 'closeChat' | 'startResistTimer';
};
