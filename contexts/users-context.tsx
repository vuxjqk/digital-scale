"use client";

import { createContext, useContext, useState } from "react";

import { User } from "@/app/generated/prisma/client";

const UsersContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateUrl: string | null;
  setUpdateUrl: React.Dispatch<React.SetStateAction<string | null>>;
  deleteUrl: string | null;
  setDeleteUrl: React.Dispatch<React.SetStateAction<string | null>>;
} | null>(null);

export default function UsersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [updateUrl, setUpdateUrl] = useState<string | null>(null);
  const [deleteUrl, setDeleteUrl] = useState<string | null>(null);

  return (
    <UsersContext.Provider
      value={{
        user,
        setUser,
        updateUrl,
        setUpdateUrl,
        deleteUrl,
        setDeleteUrl,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export const useUsers = () => {
  const context = useContext(UsersContext);

  if (context === null) {
    throw new Error("useUsers phải được sử dụng bên trong UsersProvider.");
  }

  return context;
};
