export const dishResponses = {
    createSuccess: {
        status: 201,
        description: 'Returns the created dish',
        schema: {
            example: {
                ok: true,
                data: {
                    id: 'gd7d88dfgd34gd2db',
                    name: 'pasta a la carbonara',
                    description: 'pasta al a carbonara',
                    price: 3.99,
                },
            },
        },
    },
    createBranchNotFound: {
        status: 404,
        description: 'Branch not found',
        schema: {
            example: {
                ok: false,
                message: 'Branch not found',
            },
        },
    },
    createBadRequest: {
        status: 400,
        description: 'Bad request',
    },
    getDishesSuccess: {
        status: 200,
        description: 'Returns dishes for the branch',
        schema: {
            example: [
                {
                    id: 'gd7d88dfgd34gd2db',
                    name: 'pasta a la carbonara',
                    description: 'pasta al a carbonara',
                    price: 3.99,
                },
            ]
        },
    },
    getBranchNotFound: {
        status: 404,
        description: 'Branch not found',
        schema: {
            example: {
                ok: false,
                message: 'Branch not found',
            },
        },
    },
    getDishNotFound: {
        status: 404,
        description: 'Dish not found',
        schema: {
            example: {
                ok: false,
                message: 'Dish not found',
            },
        },
    },
    getBadRequest: {
        status: 400,
        description: 'Bad request',
    },
    updateSuccess: {
        status: 200,
        description: 'Dish updated successfully',
        schema: {
            example: {
                ok: true,
                message: 'Dish updated',
            },
        },
    },
    updateBranchNotFound: {
        status: 404,
        description: 'Branch not found',
        schema: {
            example: {
                ok: false,
                message: 'Branch not found',
            },
        },
    },
    updateBadRequest: {
        status: 400,
        description: 'Bad request',
    },
    deleteSuccess: {
        status: 200,
        description: 'Dish deleted successfully',
        schema: {
            example: {
                ok: true,
                message: 'Dish deleted',
            },
        },
    },
    deleteBranchNotFound: {
        status: 404,
        description: 'Branch not found',
        schema: {
            example: {
                ok: false,
                message: 'Branch not found',
            },
        },
    },
    deleteBadRequest: {
        status: 400,
        description: 'Bad request',
    },
};
