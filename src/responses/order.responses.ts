export const orderResponses = {
    createSuccess: {
        status: 201,
        description: 'Order created successfully',
        schema: {
            example: {
                ok: true,
                message: 'Order check',
            },
        },
    },
    createBadRequest: {
        status: 400,
        description: 'Bad request',
    },
    getOrdersSuccess: {
        status: 200,
        description: 'Returns orders for the user',
        schema: {
            example: {
                ok: true,
                data: [
                    {
                        id: 'g8jfj57ds9j598dfj4',
                        amount: 3.99,
                        dish: 'pasta a la carbonara',
                    },
                ],
            },
        },
    },
    getOrdersNotFound: {
        status: 404,
        description: 'User has no orders',
        schema: {
            example: {
                ok: false,
                message: 'The user has no orders',
            },
        },
    },
};
