"use client";
import { deleteUser } from "@/actions/users";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function DeleteUser({ id }: { id: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDeleteUser = async () => {
    setLoading(true);

    const activate = await deleteUser(id);
    if (activate === null) {
      setLoading(false);
      router.refresh();
      toast.error("Something went wrong", {
        description: "Something went wrong with deleting this user",
      });
    } else {
      setLoading(false);
      router.refresh();
      toast.success("Account deleted", {
        description: "This account was deleted successfully",
      });
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className=" w-full hover:bg-red-800 bg-[#f93e3e]">
            Delete User
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className=" font-bold flex items-center gap-2">
            <TriangleAlert className=" text-red-900" />
            Delete
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this account?
          </DialogDescription>
          <DialogFooter className=" flex gap-3">
            <DialogClose className=" cursor-pointer">Close</DialogClose>
            <Button
              disabled={loading}
              onClick={handleDeleteUser}
              className="hover:bg-red-800 bg-[#f93e3e]"
            >
              {loading ? "Deleting" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
