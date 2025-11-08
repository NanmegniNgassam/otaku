type GameStatus = "VICTORY" | "DRAW" | "DEFEAT";

export interface Reward {
  credits: number;
  xp: number;
}

export interface Loss {
  credits: number;
}

export interface Game {
  id: string;
  date: Date;
  duration: number;
  reward: Reward;
  expenses: Loss;
  status: GameStatus;
}