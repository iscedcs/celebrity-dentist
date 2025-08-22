export const API = process.env.NEXT_PUBLIC_LIVE_BACKEND_URL;
export const URLS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    me: "/auth/me",
    reset: "/auth/reset-password",
    forgot: "/auth/forgot-password",
  },
  appointment: {
    public_booking: "/appointments/public-book",
  },
};
