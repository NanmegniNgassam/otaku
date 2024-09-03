import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { UserData } from '../models/user';

const USERS_COLLECTIONS = "users";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: Firestore,
    private auth: Auth
  ) {}

  async createUserDocument(userUID: string) {
    try {
      await setDoc(doc(this.db, USERS_COLLECTIONS, userUID), {
        level: 'f',
        xp: 0,
        quests: 0,
        favoriteGenres: [],
        animeListIds: [],
        streak: [new Date()],
        params: {},
      })
    } catch (error) {
      console.error("Error while creating userDoc : ", error);
      throw(error);
    }
  }

  async fetchUserData(): Promise<UserData> {
    try {
      const userDoc = await getDoc(doc(this.db, USERS_COLLECTIONS, this.auth.currentUser?.uid!))
      const userData = userDoc.data();

      return userData as UserData
    } catch (error) {
      console.log("Error while trying to read document : ", error);
      throw(error);
    }
  } 
}

// TODO: Do something about user Data and ranking