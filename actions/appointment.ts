"use server";

import { auth } from "@/auth";
import { appointmentValues } from "@/components/homepage/contact-section";
import { API, URLS } from "@/lib/const";
import { AppointmentProps, FetchAppointmentProps } from "@/lib/types";

export const bookAppointmentRequest = async (data: appointmentValues) => {
  const url = `${API}${URLS.appointment.publicBooking}`;
  const dateTimeString = `${data.date}T${data.time}`;
  const isoDate = new Date(dateTimeString).toISOString();
  const payload = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    date: isoDate,
    service: data.services,
    reason: data.reason,
  };
  console.log(url, payload);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    //   console.log()

    const data = await res.json();
    console.log({ data });

    if (data.success) {
      return data.data;
    }
    return null;
  } catch (e: any) {
    console.log("Unable to create appointment", e);
  }
};

export const getAllAppointments = async ({
  limit,
  page,
  query,
  status,
}: FetchAppointmentProps) => {
  const url = new URL(`${API}${URLS.appointment.all}`);
  url.searchParams.set("page", page?.toString() ?? "");
  url.searchParams.set("limit", limit?.toString() ?? "");
  status &&
    url.searchParams.set(
      "status",
      Array.isArray(status) ? status.join(",") : status
    );
  query &&
    url.searchParams.set("q", Array.isArray(query) ? query.join(",") : query);

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
    const success = data.success;
    const appointments: AppointmentProps[] = data.data.data;
    const totalRecord = data.data.meta.total;
    const currentPage = data.data.meta.page;
    const limit = data.data.meta.limit;
    const totalPage = data.data.meta.pages;

    // console.log({ url, BEARER_TOKEN });
    if (success) {
      return {
        appointments: appointments,
        totalRecord: totalRecord,
        currentPage: currentPage,
        limit: limit,
        totalPage: totalPage,
      };
    }
    return null;
  } catch (e: any) {
    console.log("Unable to fetch appointments", e);
    return null;
  }
};

export const approveAppointement = async (id: string) => {
  const url = `${API}${URLS.appointment.approve.replace("{id}", id)}`;
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

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
    }
    return null;
  } catch (e: any) {
    console.log("", e);
  }
};

export const completeAppointment = async (id: string) => {
  const url = `${API}${URLS.appointment.complete.replace("{id}", id)}`;
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

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
    }
    return null;
  } catch (e: any) {
    console.log("", e);
  }
};

export const cancelAppointment = async (id: string) => {
  const url = `${API}${URLS.appointment.cancel.replace("{id}", id)}`;
  const session = await auth();
  const BEARER_TOKEN = session?.user?.accessToken;

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
    }
    return null;
  } catch (e: any) {
    console.log("", e);
  }
};
