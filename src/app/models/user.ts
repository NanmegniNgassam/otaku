export interface UserData {
  level: 's'|'a'|'b'|'c'|'d'|'e'|'f';
  xp: number;
  quests: number;
  favoriteGenres: number[];
  animeListIds: number[];
  streak: Date[];
  params: {};
}