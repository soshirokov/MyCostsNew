// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { getDatabase, ref } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCqxTtWhUD2AlA2I7o7j0Yc3a9HNOm9MBw',
  authDomain: 'mycostsgb.firebaseapp.com',
  databaseURL: 'https://mycostsgb-default-rtdb.firebaseio.com',
  projectId: 'mycostsgb',
  storageBucket: 'mycostsgb.appspot.com',
  messagingSenderId: '190430056384',
  appId: '1:190430056384:web:49d4dbe03cdf2ec5574225',
  measurementId: 'G-R1DXE582H9',
}

// Initialize Firebase
// eslint-disable-next-line
const app = initializeApp(firebaseConfig)

// Методы для авторизации
export const auth = getAuth()
export const signIn = (email: string, pass: string) =>
  signInWithEmailAndPassword(auth, email, pass)
export const logout = () => signOut(auth)
const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

export const signInWithGoogle = () => signInWithPopup(auth, provider)
export const registerWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password)

// Методы для базы данных
const database = getDatabase(app)

// Профиль пользователя
export const costLevelRef = (userId: string) =>
  ref(database, `profiles/${userId}/costLevel`)

// Категории пользователя
export const userCategories = (userId: string) =>
  ref(database, `profiles/${userId}/categories`)
export const costByDateRef = (userId: string, date: string) =>
  ref(database, `costs/${userId}/${date}`)
