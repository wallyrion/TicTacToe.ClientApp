export interface GameInvitation {
  gameId: string;
  user1Email: string;
  user2Email: string;
  user1Id: string;
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

export interface GameEventDto {
  gameId: string;
  turnUserId: string;
  createdDate: string;
  outcome: OutcomeDto | undefined;
  cellEvents: CellEventDto[];
}

export interface OutcomeDto {
  cellWinIndexes: number[] | undefined;
  isDraw: boolean;
}

export interface CellEventDto {
  userId: string;
  turnDate: string;
}