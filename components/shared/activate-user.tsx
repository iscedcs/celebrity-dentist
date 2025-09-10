"use client";

import { reactivateUser } from "@/actions/users";
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

export default function ActivateUser({ id }: { id: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleActivateUser = async () => {
    setLoading(true);

    const activate = await reactivateUser(id);
    if (activate === null) {
      setLoading(false);
      router.refresh();
      toast.error("Something went wrong", {
        description: "Something went wrong with activating this user",
      });
    } else {
      setLoading(false);
      router.refresh();
      toast.success("Account activated", {
        description: "This account was activated successfully",
      });
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className=" w-full hover:bg-red-800 bg-[#f93e3e]">
            Activate User
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className=" font-bold flex items-center gap-2">
            <TriangleAlert className=" text-red-900" />
            Activate
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to activate this account?
          </DialogDescription>
          <DialogFooter className=" flex gap-3">
            <DialogClose className=" cursor-pointer">Close</DialogClose>
            <Button
              onClick={handleActivateUser}
              disabled={loading}
              className="hover:bg-red-800 bg-[#f93e3e]"
            >
              {loading ? "Activating" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
