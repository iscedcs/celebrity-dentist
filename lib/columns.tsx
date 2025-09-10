"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EllipsisVertical, Eye, SquarePen } from "lucide-react";
import Link from "next/link";
import { UserProps } from "./types";
import { getActiveBadgeColor, getRoleBadgeColor } from "./utils";

export const user_columns: ColumnDef<UserProps>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => {
      return <div className=" ">{row.original.firstName}</div>;
    },
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email Address",
  },
  {
    accessorKey: "phone",
    header: "Phone Address",
  },
  {
    accessorKey: "role",
    header: () => <div className=" text-center">Role</div>,
    cell: ({ row }) => {
      return (
        <>
          <div
            className={` font-bold py-[7px] text-[12px]  text-center cursor-default rounded-full ${getRoleBadgeColor(
              row.original.role as Role
            )}`}
          >
            {row.original.role}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => <div className=" text-center">Status</div>,
    cell: ({ row }) => {
      return (
        <>
          <div
            className={` font-bold cursor-default  py-[7px] px-[15px] text-[12px] text-center rounded-full ${getActiveBadgeColor(
              row.original.isActive
            )}`}
          >
            {row.original.isActive ? "ACTIVE" : "INACTIVE"}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => {
      return (
        <div className="">
          {format(row.original.lastLogin ?? new Date(), "PPPP")}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className=" cursor-pointer">
            <EllipsisVertical className=" w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" flex flex-col gap-3 py-[10px] px-[20px]">
            <Link
              href={`/users/${row.original.id}`}
              className=" flex gap-3 items-center"
            >
              <Eye className=" w-4 h-4" />
              <p>View user</p>
            </Link>
            {row.original.isActive && (
              <Link
                href={`/users/${row.original.id}/edit`}
                className=" flex gap-3 items-center"
              >
                <SquarePen className=" w-4 h-4" />
                <p>Edit user</p>
              </Link>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
