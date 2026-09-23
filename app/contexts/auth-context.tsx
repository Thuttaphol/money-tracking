"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type UserInfoType = {
  email: string;
  isEmailConfirmed: boolean;
} | null;

type AuthUserContextType = {
  userData: UserInfoType;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
} | null;

const AuthUserContext = createContext<AuthUserContextType>(null);

export function AuthUserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfoType>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshUser() {
    try {
      const response = await fetch(
        "http://localhost:5194/api/auth/manage/info",
        { credentials: "include", cache: "no-store" },
      );

      if (response.status === 401) {
        setUserInfo(null);
      }

      if (!response.ok) {
        throw new Error("Failed to check get current user");
      }

      const data: UserInfoType = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthUserContext.Provider
      value={{
        userData: userInfo,
        isAuthenticated: userInfo != null,
        isLoading: isLoading,
        refreshUser: refreshUser,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
}

export function useAuthUser() {
  const context = useContext(AuthUserContext);

  if (!context) {
    throw new Error("useAuthUser must be used inside AuthUserProvider");
  }

  return context;
}
