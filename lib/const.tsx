export const API = process.env.NEXT_PUBLIC_LIVE_BACKEND_URL;
export const URLS = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        me: '/auth/me',
        reset: '/auth/reset-password',
        forgot: '/auth/forgot-password',
    },
    users: {
        create: '/users',
    },
    appointment: {
        public_booking: '/appointments/public-book',
        private_me: '/appointments/me',
        all: '/appointments',
        one: '/appointments/{id}',
    },
    patients: {
        all: '/patients',
        oneById: '/patients/{id}',
        oneByPatientId: '/patients/one/{patientId}',
        approve: '/patients/{patientId}/approve',
    },
};
