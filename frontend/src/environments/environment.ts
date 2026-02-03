export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  endpoints: {
    root: '/',
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      me: '/api/auth/me',
    },
  },
};
