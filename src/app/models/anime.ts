export interface Anime {
  mal_id: number;
  approved: boolean;
  images: {
    smallFormat: string;
    largeFormat: string;
  }
  trailer: string;
  title: string;
  duration: string;
  rating: string;
  score: number;
  score_by: number;
  synopsis: string;
  genres: AnimeGenre[];
}

export interface AnimeGenre {
  id: number, 
  name: string, 
  count?: number
}