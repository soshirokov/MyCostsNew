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
import { firebaseConfig } from './firebase_config'

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
export const userCurrencyRef = (userId: string) =>
  ref(database, `profiles/${userId}/currency`)

// Категории пользователя
export const userCategories = (userId: string) =>
  ref(database, `profiles/${userId}/categories`)

// Расходы
export const costByDateRef = (userId: string, date: string) =>
  ref(database, `costs/${userId}/${date}`)
export const costByUserRef = (userId: string) =>
  ref(database, `costs/${userId}`)

// Курс валюты
export const currencyRate = (date: string, currency: string) =>
  ref(database, `settings/currencyRate/${currency}/${date}`)
