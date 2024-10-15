import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/router"; // Import useRouter
import {
  auth,
  loginWithEmail,
  logout,
  loginWithGoogle,
  registerWithEmail,
} from "../lib/auth";
import { onAuthStateChanged, User } from "firebase/auth";
import useSafePush from "./useSafePush";

interface AuthContextType {
  user: User | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter(); // Initialize useRouter
  const { safePush } = useSafePush();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [router]); // Add router to the dependency array

  const handleLoginWithEmail = async (email: string, password: string) => {
    await loginWithEmail(email, password);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleLoginWithGoogle = async () => {
    await loginWithGoogle();
  };

  const handleRegisterWithEmail = async (email: string, password: string) => {
    await registerWithEmail(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithEmail: handleLoginWithEmail,
        logout: handleLogout,
        loginWithGoogle: handleLoginWithGoogle,
        registerWithEmail: handleRegisterWithEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
