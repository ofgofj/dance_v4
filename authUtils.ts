import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// 新規登録
export const register = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

// ログイン
export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);
