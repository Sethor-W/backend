
export const authResponses = {
    registerSuccess: {
      status: 201,
      description: 'Returns the session token',
      schema: {
        example: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhZmRiODZiLWY3MDAtNDNkNi04ZjgyLTQ1NDNiYjU1MzA5MSIsIm5hbWUiOiJkeWxhbiIsImVtYWlsIjoiZXhhbXBsZUBleGFtcGxlLmNvbSIsImlhdCI6MTcxMzYyNzAxMiwiZXhwIjoxNzE2MTMyNjEyfQ.OG2Up_FoWtlm7za2276GHZq-Xz76ugpCy-eeQXTWCzQ',
        },
      },
    },
    registerError: {
      status: 400,
      description: 'New user could not be created',
    },
    loginSuccess: {
      status: 201,
      description: 'Returns the session token',
      schema: {
        example: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhZmRiODZiLWY3MDAtNDNkNi04ZjgyLTQ1NDNiYjU1MzA5MSIsIm5hbWUiOiJkeWxhbiIsImVtYWlsIjoiZXhhbXBsZUBleGFtcGxlLmNvbSIsImlhdCI6MTcxMzYyNzAxMiwiZXhwIjoxNzE2MTMyNjEyfQ.OG2Up_FoWtlm7za2276GHZq-Xz76ugpCy-eeQXTWCzQ',
        },
      },
    },
    loginError: {
      status: 400,
      description: 'Invalid credentials',
    },
  };
  