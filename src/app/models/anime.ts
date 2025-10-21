export interface Anime {
  mal_id: number;
  approved: boolean;
  images: {
    jpg : {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    }
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    }
  }
  trailer: string;
  title: string;
  title_english: string;
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