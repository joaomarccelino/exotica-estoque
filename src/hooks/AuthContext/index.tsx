import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../services/firebase";

type User = {
  displayName: string;
  role: string;
}

type AuthContextType = {
  user: User;
  handleLogin(email: string, password: string): void;
  handleLogout(): void;
}

type AuthContextProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider({ children }: AuthContextProps) {
  const STORAGE_KEY = "@exotica-estoque";
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  async function handleGetUserData(id: string) {
    const userRef = doc(firestore, "users", id);
    try {
      let userData: User = {} as User;
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        userData = {
          displayName: data.displayName,
          role: data.role
        }
      }
      setUser(userData);
      localStorage.setItem(`${STORAGE_KEY}-user`, JSON.stringify(userData));
    } catch(error) {
      throw new Error();
    }
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const userData = res.user;
      handleGetUserData(userData.uid)
      alert("Bem-vinde ao sistema!");
      navigate('/')
    } catch (error) {
      throw new Error("Houve um erro com a chamada")
    }
  }

  const handleLogout = () => {
    signOut(auth);
    localStorage.removeItem(`${STORAGE_KEY}-user`);
    navigate('/autenticacao')
  }

  async function handleCheckLogin() {
    setLoading(true);
    const userData = await JSON.parse(localStorage.getItem(`${STORAGE_KEY}-user`) || '{}');
    userData && setUser(userData);
    setLoading(false);
  }

  useEffect(() => {
    handleCheckLogin();
  }, [])

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}