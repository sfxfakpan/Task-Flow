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
    boards: {
      list: '/api/boards',
      create: '/api/boards',
      get: '/api/boards/:id',
      update: '/api/boards/:id',
      delete: '/api/boards/:id',
    },
    tasks: {
      list: '/api/boards/:boardId/tasks',
      create: '/api/boards/:boardId/tasks',
      get: '/api/boards/:boardId/tasks/:taskId',
      update: '/api/boards/:boardId/tasks/:taskId',
      updatePosition: '/api/boards/:boardId/tasks/:taskId/position',
      delete: '/api/boards/:boardId/tasks/:taskId',
    },
  },
};
