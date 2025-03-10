
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification
} from "firebase/auth";
import { auth } from "../config/firebase";


type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null; confirmEmail: boolean }>;
  signOut: () => Promise<void>;
  loading: boolean;
  onAuthStateChanged: (callback: (user: User | null) => void) => () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      return { error: null, confirmEmail: true };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error: error as Error, confirmEmail: false };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const onAuthStateChangedCallback = (callback: (user: User | null) => void) => {
    const unsubscribe = onAuthStateChanged(auth, callback);
    return unsubscribe;
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading, onAuthStateChanged: onAuthStateChangedCallback }}>
      {children}
    </AuthContext.Provider>
  );
}
