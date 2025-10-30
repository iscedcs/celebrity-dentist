"use server";

import { auth } from "@/auth";
import { CreatePatientValues } from "@/components/patients/patient-registration-form";
import { API, URLS } from "@/lib/const";
import { FetchUserProps, PatientProps } from "@/lib/types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";

//DIVINE CHANGES
export const getAllPatients = async ({
  fields,
  limit,
  page,
  query,
}: FetchUserProps) => {
  const stringFields = fields?.join(",");
  const url = new URL(`${API}${URLS.patients.all}`);
  url.searchParams.set("page", page?.toString() ?? "");
  url.searchParams.set("limit", limit?.toString() ?? "");
  query &&
    url.searchParams.set("q", Array.isArray(query) ? query.join(",") : query);
  url.searchParams.set("fields", stringFields ?? "");

  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  // console.log(url.toString());

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    // console.log(data.data.data);
    const success = data.success;
    const meta = data.data.meta;
    const records: PatientProps[] = data.data.data;

    const totalPage = meta.pages;
    const currentPage = meta.page;
    const totalRecord = meta.total;
    const setLimit = meta.limit;

    if (success) {
      return {
        records: records,
        totalPage: totalPage,
        currentPage: currentPage,
        totalRecord: totalRecord,
        setLimit: setLimit,
      };
    }
    return null;
  } catch (e: any) {
    console.log("Error fetching patients", e);
  }
};

export const getPatientsByID = async (id: string) => {
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;
  const url = `${API}${URLS.patients.oneByPatientId.replace(
    "{patientId}",
    id
  )}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    const patient: PatientProps = data.data;

    if (res.ok) {
      return patient;
    } else {
      return null;
    }
  } catch (e: any) {
    console.log("Unable to fetch patient by patient ID", e);
  }
};

export const createPatientPost = async (value: CreatePatientValues) => {
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;
  const url = `${API}${URLS.patients.create}`;

  try {
    const payload = {
      address: value.address,
      age: value.age,
      alternatePhone: value.alternatePhone,
      bloodGroup: value.bloodGroup,
      country: value.country,
      dateOfBirth: value.dateOfBirth,
      email: value.email,
      emergencyName: value.emergencyName,
      emergencyPhone: value.emergencyPhone,
      emergencyRelation: value.emergencyRelation,
      firstName: value.firstName,
      gender: value.gender,
      genotype: value.genotype,
      lastName: value.lastName,
      lga: value.lga,
      maritalStatus: value.maritalStatus,
      occupation: value.occupation,
      phone: value.phone,
      religion: value.religion,
      state: value.state,
      middleName: value.middleName,
      registeredById: value.registeredById,
      registrationType: value.registrationType,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log("Data", data);

    if (res.ok) {
      return data.data;
    } else return null;
  } catch (e: any) {
    console.log("Unable to create patient ", e);
  }
};

export const getPatientsByPatientID = async (patientId: string) => {
  const url = `${API}${URLS.patients.oneByPatientId.replace(
    "{patientId}",
    patientId
  )}`;
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    const patient: PatientProps = data.data;
    if (res.ok) {
      return patient;
    }
    return null;
  } catch (e: any) {
    console.log("", e);
  }
};

export const approvePatient = async (id: string) => {
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

  const url = `${API}${URLS.patients.approve.replace("{patientId}", id)}`;

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (res.ok) {
      return data.data;
    } else {
      return null;
    }
  } catch (e: any) {
    console.log("", e);
  }
};
