import { z } from "zod";

export const DENTAL_SERVICES = [
  "Dental Consultation",
  "Teeth Cleaning (Scaling & Polishing)",
  "Tooth Extraction",
  "Dental Fillings",
  "Root Canal Treatment",
  "Teeth Whitening",
  "Orthodontics (Braces & Aligners)",
  "Dental Implants",
  "Crowns & Bridges",
  "Dentures",
  "Pediatric Dentistry",
  "Gum Treatment",
  "Oral Surgery",
  "Emergency Dental Care",
] as const;

export const APPOINTMENT_TIMES = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;

export const bookAppointment = z.object({
  firstName: z
    .string()
    .min(2, { message: "Firstname should be greater than two characters" }),
  lastName: z
    .string()
    .min(2, { message: "Lastname should be greater than two characters" }),
  email: z.email(),
  phone: z
    .string({
      message: "Please enter phone number.",
    })
    .regex(/^0[789][01]\d{8}$/, "This is not a valid phone number"),
  date: z.string(),
  time: z.enum(APPOINTMENT_TIMES, {
    message: "Please select a valid time",
  }),
  services: z.enum(DENTAL_SERVICES, {
    message: "Please select a valid service",
  }),
  reason: z.string(),
});


export const sigIn = z.object({
  email: z.email(),
  password: z.string().min(2, { message: "Please enter a valid password" }),
});
