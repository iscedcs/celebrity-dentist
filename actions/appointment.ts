"use server";

import { appointmentValues } from "@/components/homepage/contact-section";
import { API, URLS } from "@/lib/const";

export const bookAppointmentRequest = async (data: appointmentValues) => {
  const url = `${API}${URLS.appointment.public_booking}`;
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
