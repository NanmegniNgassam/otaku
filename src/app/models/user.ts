export interface UserData {
  level: 's'|'a'|'b'|'c'|'d'|'e'|'f';
  xp: number;
  quests: number;
  favoriteGenres: number[];
  animeListIds: number[];
  streak: string[];
  params: {};
  position: number;
  playerName: string
}

export interface Ranking {
  playerName: string;
  position: number;
  trend: "up" | "down" | "steady";
  xp: number;
  level: 's'|'a'|'b'|'c'|'d'|'e'|'f';
  decoration: "top-three" | "top-ten" | "top-fifty"
}