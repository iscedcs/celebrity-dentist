import { getUserById } from "@/actions/users";
import ActivateUser from "@/components/shared/activate-user";
import DeleteUser from "@/components/shared/delete.-user";
import UserRoleUpdate from "@/components/shared/user-role-update";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRoleBadgeColor } from "@/lib/utils";
import { Role } from "@prisma/client";
import { format } from "date-fns";
import { Activity, Mail, User, WalletMinimal } from "lucide-react";
import Link from "next/link";

type Params = Promise<{ id: string }>;
export default async function SingleUserPage({ params }: { params: Params }) {
  const { id } = await params;
  const user = await getUserById(id);

  return (
    <div className=" h-screen  bg-[#f9fafb]">
      <div className=" py-[30px]   mx-auto max-w-6xl">
        <div className="">
          <h1 className="text-2xl font-bold text-gray-900">User Information</h1>
          <p className="text-gray-600">Vuew user and edit user information.</p>
        </div>
        <div className=" mt-[30px] grid grid-cols-2  gap-5">
          <Card className="">
            <CardContent>
              <span className=" flex items-center gap-4">
                <User />
                <p className="  font-bold">Personal Information</p>
              </span>

              <div className=" flex flex-wrap gap-3 mt-[20px]">
                <div className=" w-[100%]">
                  <p className=" font-bold text-[#333]">First Name</p>
                  <p>{user?.firstName ?? "No firstname provided"}</p>
                </div>
                <div className=" w-[100%]">
                  <p className=" font-bold text-[#333]">Last Name</p>
                  <p>{user?.lastName ?? "No last name provided"}</p>
                </div>
                <div className="">
                  <p className=" font-bold text-[#333]">Role</p>
                  <div
                    className={` font-bold px-[20px] py-[4px] text-[12px]  text-center cursor-default rounded-full ${getRoleBadgeColor(
                      user?.role as Role
                    )}`}
                  >
                    {user?.role}
                  </div>
                </div>
                <div className=" w-[100%]">
                  <p className=" font-bold text-[#333]">Status</p>
                  <p>{user?.isActive === true ? "ACTIVE" : "INACTIVE"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="">
            <CardContent>
              <span className=" flex items-center gap-4">
                <Mail />
                <p className="  font-bold">Contact Information</p>
              </span>

              <div className=" flex flex-wrap gap-3 mt-[20px]">
                <div className=" w-[100%]">
                  <p className=" font-bold text-[#333]">Email Address</p>
                  <p>{user?.email ?? "No email provided"}</p>
                </div>
                <div className=" w-[100%]">
                  <p className=" font-bold text-[#333]">Phone Number</p>
                  <p>{user?.phone ?? "Np phone number provided"}</p>
                </div>
                <div className=" w-[100%]">
                  <p className=" font-bold text-[#333]">User ID</p>
                  <p className=" cursor-not-allowed text-xs text-muted-foreground font-mono break-all">
                    {user?.id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="">
            <CardContent>
              <span className=" flex items-center gap-4">
                <WalletMinimal />
                <p className="  font-bold">Account Information</p>
              </span>

              <div className=" flex flex-wrap gap-3 mt-[20px]">
                <div className=" w-[100%]">
                  <p className=" font-bold text-[#333]">Account Created</p>
                  <p>{format(user?.createdAt ?? new Date(), `PPP - p`)}</p>
                </div>
                <div className=" w-[100%]">
                  <p className=" font-bold text-[#333]">Last Login</p>
                  <p>{format(user?.lastLogin ?? new Date(), `PPP - p`)}</p>
                </div>
                <div className=" w-[100%]">
                  <p className=" font-bold text-[#333]">Last Updated</p>
                  <p>{format(user?.updatedAt ?? new Date(), `PPP - p`)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="">
            <CardContent>
              <span className=" flex items-center gap-4">
                <Activity />
                <p className="  font-bold">Actions</p>
              </span>

              <div className=" flex justify-around gap-2 flex-col mt-[20px]">
                {user?.isActive === true ? (
                  <>
                    <Button asChild>
                      <Link
                        className=" w-full"
                        href={`/users/${user?.id}/edit`}
                      >
                        Update User
                      </Link>
                    </Button>
                    <UserRoleUpdate
                      role={user?.role as Role}
                      id={user?.id ?? ""}
                      user={user}
                    />
                    <DeleteUser id={user.id} />
                  </>
                ) : (
                  <div className=" w-full">
                    <ActivateUser id={user?.id ?? ""} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
