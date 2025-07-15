import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword } from "firebase/auth";

// 新規登録
export const register = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

// ログイン
export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

// パスワード変更
export const changePassword = (user: any, newPassword: string) =>
  updatePassword(user, newPassword);
