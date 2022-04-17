export interface GameInvitation {
  gameId: string;
  opponentEmail: string;
  opponentId: string;
  user2Id: string;
  firstTurnPlayerId: string;
}


export interface GameEvent {
  index: string;
  sessionId: string;
  outcome: Outcome
  gameId: string;
}

export interface GameObject {
  mark: Mark
}

export enum Mark {
  NA,
  X,
  O,
}


export enum GameOutcome {
  Win = 1,
  Lose = 2,
  Draw = 3
}

export interface Outcome {
  type: GameOutcome;
  indexes?: number[],
  winnerId?: string;
}