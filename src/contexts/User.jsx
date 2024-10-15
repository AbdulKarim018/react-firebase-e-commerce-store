import { Spinner } from "@nextui-org/react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";

const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState({
    status: "loading",
    isAuthenticated: false,
    data: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = (
          await getDoc(doc(db, "furniro_users", user.uid))
        ).data();
        setUser({
          status: "authenticated",
          isAuthenticated: true,
          data: {
            id: user.uid,
            uid: user.uid,
            email: user.email,
            ...userData,
          },
        });
      } else {
        setUser({
          status: "unauthenticated",
          data: user,
        });
      }
    });
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={user}>
      {user.status === "loading" ? (
        <div className="flex h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const user = useContext(UserContext);
  return user;
};
