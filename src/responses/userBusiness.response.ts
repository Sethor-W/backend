export const userBusinessResponse = {
  getUserByIdSuccess: {
    status: 200,
    schema: {
      example: {
        id: 'werw87e7w7rwrw7rw78',
        name: 'pedro',
        lastName: 'fernandez',
        rut: '34453353533',
        email: 'pedro@gamil.com',
        phone: '554545332453',
      },
    },
  },
  getUserByIdError: {
    status: 400,
    description: 'bad request',
  },
  generateEP: { status: 200, schema: { example: '74gk6D' } },
};
