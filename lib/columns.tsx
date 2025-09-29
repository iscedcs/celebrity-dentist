"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AppointmentStatus, Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EllipsisVertical, Eye, SquarePen } from "lucide-react";
import Link from "next/link";
import { DummyAppointmentProps, PatientProps, UserProps } from "./types";
import {
  getActiveBadgeColor,
  getAppointmentStatusColor,
  getPatientStatusColor,
  getRoleBadgeColor,
} from "./utils";

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
    cell: ({ row }) => {
      return <div className="">{row.original.phone ?? "- - "}</div>;
    },
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

export const patient_columns: ColumnDef<PatientProps>[] = [
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
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      return (
        <div className="">
          <p className=" capitalize">
            {row.original.gender?.toLowerCase() ?? "No Information"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "patientId",
    header: "Patient ID",
    cell: ({ row }) => {
      return (
        <p className=" text-[12px] pl-[10px] bg-gray-300/30 rounded-[6px] py-[5px]  font-mono">
          {row.original.patientId}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className=" text-center">Status</div>,
    cell: ({ row }) => {
      return (
        <>
          <div
            className={` font-bold cursor-default  py-[7px] px-[15px] text-[12px] text-center rounded-full ${getPatientStatusColor(
              row.original.status
            )}`}
          >
            {row.original.status}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "registrationType",
    header: () => <div className=" text-center">Registered By</div>,
    cell: ({ row }) => {
      return (
        <>
          <div
            className={` font-bold py-[7px] text-[12px]  text-center cursor-default rounded-full ${getRoleBadgeColor(
              row.original.registrationType as Role
            )}`}
          >
            {row.original.registrationType}
          </div>
        </>
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
              href={`/patients/${row.original.patientId}`}
              className=" flex gap-3 items-center"
            >
              <Eye className=" w-4 h-4" />
              <p>View patient</p>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const appointment_columns: ColumnDef<DummyAppointmentProps>[] = [
  {
    accessorKey: "patientId",
    header: " Patient ID",
    cell: ({ row }) => {
      return (
        <p className=" text-[12px] pl-[10px] bg-gray-300/30 rounded-[6px] py-[5px]  font-mono">
          {row.original.patientId}
        </p>
      );
    },
  },
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
    cell: ({ row }) => {
      return <div className=" ">{row.original.lastName}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email Address",
    cell: ({ row }) => {
      return <div className=" ">{row.original.email}</div>;
    },
  },
  {
    accessorKey: "service",
    header: "Service Type",
    cell: ({ row }) => {
      return <div className=" w-[150px] truncate ">{row.original.service}</div>;
    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      return <div className=" ">{row.original.time}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return (
        <div className="">
          {format(row.original.date ?? new Date(), "PPPP")}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
    cell: ({ row }) => {
      return <div className=" ">{row.original.phone}</div>;
    },
  },

  {
    accessorKey: "status",
    header: () => <div className=" text-center">Status</div>,
    cell: ({ row }) => {
      return (
        <>
          <div
            className={` font-bold cursor-default  py-[7px] px-[15px] text-[12px] text-center rounded-full ${getAppointmentStatusColor(
              row.original.status as AppointmentStatus
            )}`}
          >
            {row.original.status}
          </div>
        </>
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
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuContent className=" cursor-pointer flex flex-col gap-3 py-[10px] px-[20px]">
                <div className=" flex gap-3 items-center">
                  <Eye className=" w-4 h-4" />
                  <p>View Information</p>
                </div>
              </DropdownMenuContent>
            </DialogTrigger>
            <DialogContent>
              <ScrollArea className=" h-[500px] md:h-full">
                <DialogTitle>Appointment Information</DialogTitle>

                <div className=" flex flex-col gap-6 mt-[20px]">
                  <div className=" flex items-center gap-2 justify-between">
                    <span className=" flex items-center gap-2">
                      <p className=" font-medium">Assigned Patient ID:</p>
                      <p className=" text-[12px] px-[10px] bg-gray-300/30 rounded-[6px] py-[5px]  font-mono">
                        {row.original.patientId}
                      </p>
                    </span>
                    <div
                      className={` font-bold cursor-default  py-[7px] px-[15px] text-[12px] text-center rounded-full ${getAppointmentStatusColor(
                        row.original.status as AppointmentStatus
                      )}`}
                    >
                      {row.original.status}
                    </div>
                  </div>

                  <div className=" grid grid-cols-1 md:grid-cols-2  ">
                    <div className="">
                      <span>
                        <p className=" font-medium">Name:</p>
                        {row.original.firstName} {row.original.lastName}
                      </span>
                      <p>
                        <span className=" font-medium">Phone Number:</span>
                        <br />
                        {row.original.phone}
                      </p>
                    </div>
                    <div className="">
                      <span>
                        <p className=" font-medium">Time:</p>

                        {row.original.time}
                      </span>
                      <span>
                        <p className=" font-medium">Date:</p>
                        {format(row.original.date ?? new Date(), "PPPP")}
                      </span>
                    </div>
                  </div>

                  <div className=" bg-gray-400/20 py-[10px] px-[15px] rounded-[20px]">
                    <p className=" font-medium">Service Type:</p>
                    <div className="">
                      <p>{row.original.service}</p>
                    </div>
                  </div>

                  <div className=" bg-gray-400/20 py-[10px] px-[15px] rounded-[20px]">
                    <p className=" font-medium">Reason:</p>
                    <div className="">
                      <p>
                        {" "}
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Accusamus quod reiciendis sunt, rem esse quidem veniam
                        tempora enim soluta ullam laboriosam voluptas
                        reprehenderit. Aliquid libero sapiente amet minima rem
                        eius.
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button className="">Approve</Button>
                    <Button className=" bg-emerald-800 hover:bg-emerald-600">
                      Complete
                    </Button>
                    <Button className="hover:bg-red-800 bg-[#f93e3e]">
                      Cancel
                    </Button>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </div>

                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </DropdownMenu>
      );
    },
  },
];
