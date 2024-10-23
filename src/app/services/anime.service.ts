import { Injectable } from '@angular/core';
import { Anime, AnimeGenre } from '../models/anime';

export const EXPLICIT_CONTENT_GENRES = [
  "Ecchi", "Erotica", "Hentai", "Adult Cast", 
]

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  /**
   * generate an array with the specified number of animes
   * 
   * @param numberOfAnimesRequested number of animes to return 
   * @returns an array of animes
   */
  async getRandomAnimes(numberOfAnimesRequested: number): Promise<Anime[]> {
    let requestedAnimes:Anime[] = [];
    let animesFetchedIds: number[] = [];

    while(requestedAnimes.length < numberOfAnimesRequested) {
      // fetch a random anime
      const anime = await this.getRandomAnime();

      // If the anime wasn't already fetched add it in the array
      if(anime && !animesFetchedIds.includes(anime.mal_id)) {
        requestedAnimes.push(anime);
        animesFetchedIds.push(anime.mal_id);
      }
    }

    return requestedAnimes;
  }

  /**
   * return a random anime
   * 
   * @returns an anime
   */
  async getRandomAnime(): Promise<Anime> {
    const res = await fetch('https://api.jikan.moe/v4/random/anime');
    const anime = await res.json();

    return anime.data as Anime;
  }

  /**
   * Get a specific anime using its id.
   * 
   * @param id the anime mal_id
   * @returns the anime requested by its id
   */
  async getAnimeById(id: number): Promise<Anime> {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
    const anime = await res.json();

    return anime.data as Anime;
  }

  /**
   * Fetch all animes genre available
   * 
   * @returns anime genres
   */
  async getAnimeGenres(): Promise<AnimeGenre[]> {
    const response = await fetch('https://api.jikan.moe/v4/genres/anime');
    const genres = await response.json() as {data: AnimeGenre[]};

    return genres.data as AnimeGenre[];
  }

  /**
   * Suggest genres to users
   * 
   * @param userGenres the current user anime genres
   * @returns an array of genre suggestions
   */
  async suggestAnimeGenres(userGenres: string[]): Promise<string[]> {
    const allGenres = (await this.getAnimeGenres()).map((genre) => genre.name);
    
    // Withdraw forbidden & useless genres
    const allowedandUsefullGenres = allGenres.filter((genre) => !userGenres.includes(genre) && !EXPLICIT_CONTENT_GENRES.includes(genre));

    // Generate suggestions from user favorite genres
    const shuffleGenres = allowedandUsefullGenres.sort(() => 0.5 - Math.random());
    const selectedGenres = shuffleGenres.slice(0, 20);

    return selectedGenres;
  }
}

