import React, { createContext, useState, useCallback, useEffect } from 'react';
import { Parent, Admin } from '../types';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface CurrentUser {
    role: 'admin' | 'parent';
    user: Admin | Parent;
}

interface AuthContextType {
    currentUser: CurrentUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    createParentAccount: (data: Omit<Parent, 'id' | 'studentIds'>, password: string) => Promise<void>;
    createAdminAccount: (data: Omit<Admin, 'id'>, password: string) => Promise<void>;
}

// ★ここが重要！
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
            if (user) {
                let docRef = doc(db, 'admins', user.uid);
                let docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setCurrentUser({ role: 'admin', user: { id: user.uid, ...docSnap.data() } as Admin });
                } else {
                    docRef = doc(db, 'parents', user.uid);
                    docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setCurrentUser({ role: 'parent', user: { id: user.uid, ...docSnap.data() } as Parent });
                    } else {
                        await signOut(auth);
                        setCurrentUser(null);
                    }
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
    };

    const createParentAccount = async (data: Omit<Parent, 'id' | 'studentIds'>, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, password);
        const parentData = { ...data, studentIds: [] };
        await setDoc(doc(db, "parents", userCredential.user.uid), parentData);
    };

    const createAdminAccount = async (data: Omit<Admin, 'id'>, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, password);
        await setDoc(doc(db, "admins", userCredential.user.uid), data);
    };

    const value = { currentUser, loading, login, logout, createParentAccount, createAdminAccount };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
