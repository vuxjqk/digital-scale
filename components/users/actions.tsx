"use client";

import { SquarePen, Trash } from "lucide-react";

import { User } from "@/app/generated/prisma/client";
import { useUsers } from "@/contexts/users-context";

import { Button } from "../ui/button";

export default function Actions({ user }: { user: User }) {
  const { setUser, setUpdateUrl, setDeleteUrl } = useUsers();

  return (
    <>
      <Button
        size="icon-sm"
        className="bg-yellow-600 hover:bg-yellow-500"
        onClick={() => {
          setUpdateUrl(`users/${user.id}`);
          setUser(user);
        }}
      >
        <SquarePen />
      </Button>
      <Button
        size="icon-sm"
        className="bg-red-600 hover:bg-red-500"
        onClick={() => setDeleteUrl(`users/${user.id}`)}
      >
        <Trash />
      </Button>
    </>
  );
}
