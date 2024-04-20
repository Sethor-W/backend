export const companyResponses = {
    registerSuccess: {
        status: 201,
        description: 'Returns the registered company',
        schema: {
            example: {
                id: 'fuf77d9d8h3hj88',
                name: 'company name',
                phone: '900 23232233',
                description: 'product manufacturing company',
            },
        },
    },
    registerError: {
        status: 400,
        description: 'Error when registering company',
    },
    getCompaniesSuccess: {
        status: 200,
        description: 'Returns companies for the user',
        schema: {
            example: {
                result: ['Companies...'],
            },
        },
    },
    getCompaniesError: {
        status: 404,
        description: 'Companies not found',
    },
    deleteCompanySuccess: {
        status: 200,
        description: 'Delete company successful',
        schema: {
            example: {
                ok: true,
                message: 'Company delete',
            },
        },
    },
    deleteCompanyError: {
        status: 404,
        description: 'Company not found',
        schema: {
            example: {
              ok: true,
              message: 'company not found',
            },
        },
    },
    updateCompanySuccess: {
        status: 200,
        description: 'Update company successful',
        schema: {
            example: {
                ok: true,
                message: 'Company info updated',
            },
        },
    },
    updateCompanyError: {
        status: 404,
        description: 'Company not found',
        schema: {
            example: {
              ok: true,
              message: 'company not found',
            },
        },
    },
};
