import { Injectable } from '@angular/core';
import { Anime } from '../models/anime';

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
}
