"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    accessorKey: "patient.firstName",
    header: "First Name",
    cell: ({ row }) => {
      return <div className=" ">{row.original.firstName}</div>;
    },
  },
  {
    accessorKey: "patient.lastName",
    header: "Last Name",
    cell: ({ row }) => {
      return <div className=" ">{row.original.lastName}</div>;
    },
  },
  {
    accessorKey: "patient.email",
    header: "Email Address",
    cell: ({ row }) => {
      return <div className=" ">{row.original.email}</div>;
    },
  },
  {
    accessorKey: "patient.phone",
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
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <div className="">
          {format(row.original.createdAt ?? new Date(), "PPPP")}
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
              href={`/appointment/${row.original.id}`}
              className=" flex gap-3 items-center"
            >
              <Eye className=" w-4 h-4" />
              <p>View appointment</p>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
