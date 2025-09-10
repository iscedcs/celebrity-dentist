"use client";

import { updateUserRole } from "@/actions/users";
import { Roles } from "@/lib/const";
import { UserProps } from "@/lib/types";
import { getRoleBadgeColor } from "@/lib/utils";
import { Role } from "@prisma/client";
import { SquareUserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function UserRoleUpdate({
  id,
  user,
}: {
  id: string;
  role: Role;
  user: UserProps | undefined | null;
}) {
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  const handleRoleUpdate = async () => {
    setLoading(true);
    const update = await updateUserRole(id, selected);
    if (update === null) {
      setLoading(false);
      toast.error("Something went wrong.", {
        description: "Something went wrong with updating user role",
      });
      router.refresh();
    } else {
      setLoading(false);
      toast.success(`Role updated successfully`, {
        description: `User role was updated to ${selected}`,
      });
      router.refresh();
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Change User Role</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-bold flex items-center gap-2">
          <SquareUserRound className=" text-emerald-700" />
          Change User Role
        </DialogTitle>
        <div className=" flex items-center gap-3">
          <p>Current Role: </p>
          <div className="">
            <div
              className={` font-bold px-[20px] py-[4px] text-[12px]  text-center cursor-default rounded-full ${getRoleBadgeColor(
                user?.role as Role
              )}`}
            >
              {user?.role}
            </div>
          </div>
        </div>
        <div className=" flex items-center gap-3">
          <p>Select Role: </p>
          <Select defaultValue={selected} onValueChange={handleSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {Roles.map((role, k) => (
                <SelectItem key={k} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className=" flex gap-3">
          <DialogClose className=" cursor-pointer">Close</DialogClose>
          <Button disabled={loading} onClick={handleRoleUpdate} className="">
            {loading ? "Updating" : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
