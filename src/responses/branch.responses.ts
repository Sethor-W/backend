export const branchResponses = {
    createSuccess: {
      status: 201,
      description: 'Returns the created branch',
      schema: {
        example: {
          id: 'fsfshgj88tr8r88r9',
          address: 'Av siempre viva',
          phone: '900 343434',
          opening_days: 'lunes a viernes',
          opening_time: '8:00 am',
          closing_time: '7:00 pm',
        },
      },
    },
    createError: {
      status: 400,
      description: 'Bad request',
    },
    
    getBranchesSuccess: {
      status: 200,
      description: 'Returns branches for the company',
      schema: {
        example: {
          result: ['Branches...'],
        },
      },
    },
    getBranchesError: {
      status: 404,
      description: 'Branches not found',
    },
    getBranchByIdSuccess: {
      status: 200,
      description: 'Returns the branch by ID',
      schema: {
        example: {
          id: 'fsfshgj88tr8r88r9',
          address: 'Av siempre viva',
          phone: '900 343434',
          opening_days: 'lunes a viernes',
          opening_time: '8:00 am',
          closing_time: '7:00 pm',
        },
      },
    },
    getBranchByIdError: {
      status: 404,
      description: 'Branch not found',
    },

    updateBranchSuccess: {
      status: 200,
      description: 'Update branch successful',
      schema: {
        example: {
          ok: true,
          message: 'Update branch',
        },
      },
    },
    updateBranchErrorBadRequest: {
      status: 400,
      description: 'Bad Request',
    },
    updateBranchError: {
      status: 404,
      description: 'Company not found',
      schema: {
        example: {
          ok: false,
          message: 'Company not found',
        },
      },
    },

    deleteBranchSuccess: {
      status: 200,
      description: 'Delete branch successful',
      schema: {
        example: {
          ok: true,
          message: 'Delete branch',
        },
      },
    },
    deleteBranchError: {
      status: 404,
      description: 'Company not found',
      schema: {
        example: {
          ok: false,
          message: 'Company not found',
        },
      },
    },
    deleteBranchErrorBadRequest: {
        status: 400,
        description: 'Bad Request',
    },

    getAllBranchSuccess: {
      status: 200,
      description: 'Returns all branches',
      schema: {
        example: {
          result: ['Branches...'],
        },
      },
    },
  };
  