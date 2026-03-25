/**
 * ============================================================
 * File: AuthContext.tsx
 * Purpose: Firebase Authentication context for Visible.
 * Replaces Auth0 with Firebase email/password auth.
 * ============================================================
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// ── Types ────────────────────────────────────────────────────

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  jobTitle: string;
  company: string;
  address: string;
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

// ── Context ──────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const profileDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  // Register new user
  const register = async (
    email: string,
    password: string,
    name: string
  ) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const newProfile: UserProfile = {
      uid: credential.user.uid,
      email,
      name,
      jobTitle: "",
      company: "",
      address: "",
      createdAt: new Date().toISOString(),
    };
    // Create user document in Firestore
    await setDoc(doc(db, "users", credential.user.uid), newProfile);
    setProfile(newProfile);
  };

  // Login existing user
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  // Update profile in Firestore
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), data);
    setProfile((prev) => (prev ? { ...prev, ...data } : prev));
  };

  // Delete account and Firestore document
  const deleteAccount = async () => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid));
    await user.delete();
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
