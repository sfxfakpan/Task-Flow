export const environment = {
  production: true,
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
