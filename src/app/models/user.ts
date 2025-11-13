import { Game } from "./party";

export type UserLevel = 's'|'a'|'b'|'c'|'d'|'e'|'f';
export type NotificationType = 'action' | 'ranking' | 'info';

export interface UserData {
  level: UserLevel;
  xp: number;
  credits: number;
  quests: number;
  favoriteGenres: string[];
  animeListIds: number[];
  streak: string[];
  params: {forbiddenGenres: string[]};
  position: number;
  playerName: string;
  games: Game[];
  notifications: Notification[];
}

export interface Ranking {
  playerName: string;
  position: number;
  trend: "up" | "down" | "steady";
  xp: number;
  level: UserLevel;
  decoration: "top-three" | "top-ten" | "top-fifty";
}

export interface Notification {
  type: NotificationType;
  title: string;
  message: string;
  isUnread: boolean;
  isPositive: boolean;
  action?: string;
  date: Date;
}

