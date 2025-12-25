import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, updateProfile, User } from '@angular/fire/auth';
import { doc, DocumentData, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { deleteObject, getDownloadURL, listAll, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { Ranking, UserData } from '../models/user';
import { EXPLICIT_CONTENT_GENRES } from '../features/animes/services/anime.service';

const USERS_COLLECTION = "users";
const OVERVIEW_COLLECTION = 'overview'
const RANKING_DOC = 'players-ranking'
const GENERAL_USERS_DOC = 'users';
const GAMES_COLLECTION = 'games';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: Firestore,
    private auth: Auth,
    private storage: Storage
  ) {}

  /**
   * Create a document for the current user/player
   * 
   * @param userUID the UID of the current user
   */
  async createUserDocument(userUID: string): Promise<void> {
    try {
      // Create the basic document in users collection
      await setDoc(doc(this.db, USERS_COLLECTION, userUID), {
        level: 'f',
        xp: 0,
        quests: 0,
        favoriteGenres: [],
        animeListIds: [],
        streak: [new Date().toLocaleDateString("en-EN")],
        params: { forbiddenGenres: EXPLICIT_CONTENT_GENRES },
        position: null,
        credits: 0,
        playerName: this.auth.currentUser?.displayName,
        games: [],
        notifications: [
          {
            type: 'info',
            title: 'Welcome !',
            message: 'Your account has been successfully created !',
            isUnread: true,
            isPositive: true,
            date: new Date().toLocaleString("en-EN")
          }
        ]
      });

      // Create the basic document in games collection
      await setDoc(doc(this.db, GAMES_COLLECTION, userUID), {
        games: [],
      });
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
      const user = await new Promise<User>((resolve, reject) => {
        const unsub = onAuthStateChanged(this.auth, (u) => {
          unsub(); // stop listening once we get an answer
          if (u) resolve(u);
          else reject(new Error("User not authenticated"));
        });
      });

      const userDocRef = doc(this.db, USERS_COLLECTION, user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error(`User document not found for uid ${user.uid}`);
      }

      return userDoc.data() as UserData;
    } catch (error) {
      console.error("Error while trying to read document:", error);
      throw error;
    }
  }

  /**
   * Update a user doc according to user activities
   * 
   * @param data a piece of UserData to modify
   * @returns a user doc
   */
  async updateUserDoc(data: Partial<UserData>): Promise<UserData> {
    try {
      // Fetch user data
      const userData = await this.fetchUserData();

      // generate new data from previous user data
      const newUserData: UserData = {
        ...userData,
        ...data
      }

      // upload newly generated user data
      await updateDoc(doc(this.db, USERS_COLLECTION, this.auth.currentUser?.uid!), {...newUserData})

      return newUserData;
    } 
    catch(error) {
      console.error("Error while trying to update user document : ", error);
      throw(error);
    }
  }

  /**
   * Set all notifications `isUnread` status to false
   */
  async setNotificationsRead(): Promise<void> {
    try {
      // Fetch user data
      const userData = await this.fetchUserData();

      // Set all notifications as read
      const notifications = userData.notifications.map((notif) => {
        return {
          ...notif,
          isUnread: false,
        }
      })

      // update user doc
      await this.updateUserDoc({notifications})
    } 
    catch(error) {
      console.error("Error while trying to update user document : ", error);
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

  /**
   * Fetch and return the game rankings
   * 
   * @returns all the ranking 
   */
  async getRanking(): Promise<Ranking[]> {
    try {
      const rankingDoc = await getDoc(doc(this.db, OVERVIEW_COLLECTION, RANKING_DOC))
      const rankingData = rankingDoc.data();

      return rankingData!["ranking"] as Ranking[]
    } catch(error) {
      console.error("Error while getting the ranking : ", error)
      throw(error)
    }
  }

  /**
   * get the date when the ranking was lately updated
   * 
   * @returns the last update date
   */
  async getLastRankingUpdateDate(): Promise<Date> {
    try {
      const rankingDoc = await getDoc(doc(this.db, OVERVIEW_COLLECTION, RANKING_DOC))
      const rankingData = rankingDoc.data();

      return new Date(rankingData!["lastUpdate"])
    } catch(error) {
      console.error("Error while getting the date of the last ranking update : ", error)
      throw(error)
    }
  }

  /**
   * Get the next day when the ranking will be update
   * 
   * @returns the next ranking update date
   */
  getNextRankingUpdateDate(): Date {
    const currentDate = new Date();

    // Start by the next calendar day
    let eventualNextRankingDate= new Date(new Date().setDate(currentDate.getDate() + 1))

    while(eventualNextRankingDate.getDay() !== 6) {
      // go to the next day
      eventualNextRankingDate = new Date(new Date(eventualNextRankingDate).setDate(eventualNextRankingDate.getDate() + 1))
    }

    // Set the update ranking time to midnight
    const nextRankingDate = new Date(eventualNextRankingDate.toLocaleDateString("en-EN"));

    return nextRankingDate;
  }

  /**
   * save a file with a specific extension in the cloud bucket
   * 
   * @param avatarFile the file to store
   * @param fileExtension file extension
   */
  async storeNewAvatar(avatarFile: Blob, fileExtension: string): Promise<void> {
    // Delete all the file in the current avatar doc
    await this.deleteAvatarDocContent();

    // Store the blob file on firebase.
    const destinationUrl = `avatars/${this.auth.currentUser?.uid}/${this.auth.currentUser?.displayName}.${fileExtension}`
    const avatarRef = ref(this.storage, destinationUrl)
    await uploadBytesResumable(avatarRef, avatarFile);

    // Get the corresponding url and update user profile
    const avatarUrl = await getDownloadURL(avatarRef);
    await updateProfile(this.auth.currentUser!, {photoURL: avatarUrl})
  }

  /**
   * Delete all avatar doc content
   */
  async deleteAvatarDocContent() : Promise<void> {
    // Get all the doc content
    const listRef = ref(this.storage, `avatars/${this.auth.currentUser?.uid}`)
    const listResult = await listAll(listRef);
    
    // Delete all items
    listResult.items.forEach( async (itemRef) => {
      await deleteObject(itemRef)
    })
  }

  /**
   * Get all general users data
   * 
   * @returns an object of general data about users
   */
  async getGeneralUsersData(): Promise<string[]> {
    try {
      const usersDoc = await getDoc(doc(this.db, OVERVIEW_COLLECTION, GENERAL_USERS_DOC))
      const generalUsersData = usersDoc.data() as { playerNames: string[] };

      return  generalUsersData.playerNames;
    } catch(error) {
      console.error("Error while getting the general users data : ", error)
      throw(error)
    }
  }

  /**
   * Modify a user pseudo in the general users doc
   * 
   * @param oldPseudo the username to remove from general users doc
   * @param newPseudo the username to add to general users doc
   */
  async modifyPseudofromUsersData(oldPseudo: string, newPseudo: string): Promise<void> {
    try {
      let playerNames = await this.getGeneralUsersData();

      // Remove the old password and add the new one.
      playerNames = playerNames.filter((pseudo) => pseudo !== oldPseudo);
      playerNames.push(newPseudo);

      // Update the global doc.
      await updateDoc(doc(this.db, OVERVIEW_COLLECTION, GENERAL_USERS_DOC), { playerNames })
    } catch (error) {
      console.error("Error while updating pseudo in users doc : ", error);
      throw(error);
    }
  }
 }