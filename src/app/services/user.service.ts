import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { UserData } from '../models/user';

const USERS_COLLECTION = "users";
const OVERVIEW_COLLECTION = 'overview'
const RANKING_DOC = 'players-ranking'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: Firestore,
    private auth: Auth
  ) {}

  /**
   * Create a document for the current user/player
   * 
   * @param userUID the UID of the current user
   */
  async createUserDocument(userUID: string): Promise<void> {
    try {
      await setDoc(doc(this.db, USERS_COLLECTION, userUID), {
        level: 'f',
        xp: 0,
        quests: 0,
        favoriteGenres: [],
        animeListIds: [],
        streak: [new Date().toLocaleDateString("en-EN")],
        params: {},
        position: null
      })
    } catch (error) {
      console.error("Error while creating userDoc : ", error);
      throw(error);
    }
  }

  /**
   * Get the user document containing all its game stats and more
   * 
   * @returns the document of the current user/player
   */
  async fetchUserData(): Promise<UserData> {
    try {
      const userDoc = await getDoc(doc(this.db, USERS_COLLECTION, this.auth.currentUser?.uid!))
      const userData = userDoc.data();

      return userData as UserData
    } catch (error) {
      console.error("Error while trying to read document : ", error);
      throw(error);
    }
  }

  /**
   * Determine the newest number of consecutives loggedIn days
   * 
   * @param streak an array of game loggedIn days
   * @returns the newest number of consecutives days
   */
  getUserStreak(streak: string[]):number {
    const currentStreak = streak.reverse();
    let userStreak = 0;
    let lastStreakDay = new Date(currentStreak[0]);

    // Determine if the streak has an entry day
    if(lastStreakDay) {
      userStreak++;
      for(let i = 1; i < currentStreak.length; i++) {
        const assumedNextStreakDay = new Date(lastStreakDay.setDate(lastStreakDay.getDate() + 1));
        if(currentStreak[i] === assumedNextStreakDay.toLocaleDateString('en-EN')) {
          userStreak++;
          // Going forward with the streak
          lastStreakDay = assumedNextStreakDay;
        } else {
          userStreak = 1;
          // Change the streak entry point
          lastStreakDay = new Date(currentStreak[i]);
        }
      }
    } else {
      return 0;
    }

    return Math.min(7, Math.max(userStreak, 0));
  }

  /**
   * Make the streak stat up-to-date
   * 
   * @param streak an array of game loggedIn days
   */
  async updateUserStreak(streak: string[]): Promise<string[]> {
    const lastStreakDay = new Date(streak[0]);

    // Check if the user streak is up to date
    if(lastStreakDay.toLocaleDateString('en-EN') !== new Date().toLocaleDateString('en-EN')) {
      // not the case, then add the current day
      const formatedStreakDay = new Date().toLocaleDateString('en-EN');
      const currentStreak = streak;
      currentStreak.unshift(formatedStreakDay);

      // update the streak stat on firestore
      try {
        updateDoc(doc(this.db, USERS_COLLECTION, this.auth.currentUser!.uid), {
          streak: currentStreak.slice(0, 7)
        })
        return currentStreak.slice(0, 7);
      } catch(error) {
        console.error("Error while updating the streak stat : ", error);
        throw(error);
      }
    } else {
      // Your streak is up-to-date
      return streak;
    }
  }

  async getRanking() {
    const fakeRanking = [
      {
        playerName: "Gilles NGASSAM",
        userUID: "azertyuiop",
        position: 1,
        trend: "up",
        xp: 21500,
        level: "s",
        decoration: "top-three" 
      },
      {
        playerName: "Gilles NGASSAM",
        userUID: "azertyuiop",
        position: 2,
        trend: "up",
        xp: 21500,
        level: "s",
        decoration: "top-three" 
      },
      {
        playerName: "Gilles NGASSAM",
        userUID: "azertyuiop",
        position: 3,
        trend: "up",
        xp: 21500,
        level: "s",
        decoration: "top-three" 
      }
      ,  {
        playerName: "Gilles NGASSAM",
        userUID: "azertyuiop",
        position: 4,
        trend: "down",
        xp: 21500,
        level: "s",
        decoration: "top-ten" 
      },
      {
        playerName: "Gilles NGASSAM",
        userUID: "azertyuiop",
        position: 5,
        trend: "up",
        xp: 21500,
        level: "s",
        decoration: "top-ten" 
      },
      {
        playerName: "Gilles NGASSAM",
        userUID: "azertyuiop",
        position: 6,
        trend: "steady",
        xp: 21500,
        level: "s",
        decoration: "top-ten" 
      },
      {
        playerName: "Gilles NGASSAM",
        userUID: "azertyuiop",
        position: 7,
        trend: "up",
        xp: 21500,
        level: "s",
        decoration: "top-ten" 
      },
      {
        playerName: "Gilles NGASSAM",
        userUID: "azertyuiop",
        position: 8,
        trend: "up",
        xp: 21500,
        level: "s",
        decoration: "top-ten" 
      },
      {
        playerName: "Gilles NGASSAM",
        userUID: "azertyuiop",
        position: 9,
        trend: "up",
        xp: 21500,
        level: "s",
        decoration: "top-ten" 
      },
      {
        playerName: "Gilles NGASSAM",
        userUID: "c13bzyYoZAXF4TEICGPsNmndvME2",
        position: 10,
        trend: "up",
        xp: 21500,
        level: "s",
        decoration: "top-ten" 
      },
      {
        playerName: "Gilles NGASSAM",
        userUID: "azertyuiop",
        position: 11,
        trend: "steady",
        xp: 21500,
        level: "s",
        decoration: "top-fifty" 
      }
    ];

    try {
      const rankingDoc = await getDoc(doc(this.db, OVERVIEW_COLLECTION, RANKING_DOC))
      const rankingData = rankingDoc.data();

      console.log("Fetched ranking : ", rankingData)
    } catch(error) {
      console.error("Error while getting the ranking : ", error)
      throw(error)
    }

    return fakeRanking;
  }
}