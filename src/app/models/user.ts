export interface UserData {
  level: 's'|'a'|'b'|'c'|'d'|'e'|'f';
  xp: number;
  quests: number;
  favoriteGenres: number[];
  animeListIds: number[];
  streak: string[];
  params: {};
  position: number;
  playerName: string;
  notifications: Notification[];
}

export interface Ranking {
  playerName: string;
  position: number;
  trend: "up" | "down" | "steady";
  xp: number;
  level: 's'|'a'|'b'|'c'|'d'|'e'|'f';
  decoration: "top-three" | "top-ten" | "top-fifty";
}

export interface Notification {
  type: 'action' | 'ranking' | 'info';
  title: string;
  message: string;
  isUnread: boolean;
  isPositive: boolean;
  action?: string;
  date: Date
}