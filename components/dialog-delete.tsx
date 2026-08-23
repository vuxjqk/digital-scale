"use client";

import { useState } from "react";

import { useUsers } from "@/contexts/users-context";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export default function DialogDelete() {
  const { deleteUrl, setDeleteUrl } = useUsers();
  const [loading, setLoading] = useState(false);

  return (
    <Dialog
      open={!!deleteUrl}
      onOpenChange={(open) => !open && setDeleteUrl(null)}
    >
      <DialogContent>
        <form>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa mục này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button type="submit" variant="destructive" disabled={loading}>
              {loading ? "Đang tải..." : "Xóa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
