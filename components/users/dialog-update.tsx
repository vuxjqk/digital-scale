"use client";

import { useForm } from "react-hook-form";

import { useUsers } from "@/contexts/users-context";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function DialogUpdate() {
  const { updateUrl, setUpdateUrl } = useUsers();

  const {
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  return (
    <Dialog
      open={!!updateUrl}
      onOpenChange={(open) => !open && setUpdateUrl(null)}
    >
      <DialogContent>
        <form>
          <DialogHeader>
            <DialogTitle>Cập nhật</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                placeholder="Nguyễn Văn A"
                {...register("fullName")}
              />
              <FieldError errors={[errors.fullName]} />
            </Field>
            <Field>
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                placeholder="nguyen_van_a"
                {...register("username")}
              />
              <FieldError errors={[errors.username]} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang tải..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
