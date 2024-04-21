export const employeeResponses = {
    createEmployeeSuccess: {
        status: 201,
        description: 'Employee created successfully',
        schema: {
            example: {
                name: 'juab',
                lastName: 'lopez',
                email: 'juan@gmail.com',
                phone: '59903453553',
                rut: 'c343434f34f434',
                key_word: 'cafecito',
                credential: 'c343434f34f434.cafecito',
                type: 'manager/worker',
                ep: 'manager/worker',
            },
        },
    },
    createEmployeeConflict: {
        status: 200,
        description: 'The employee already exists',
        schema: {
            example: {
                ok: false,
                message: 'The employee already exists',
            },
        },
    },
    createEmployeeBadRequest: {
        status: 400,
        description: 'Bad request',
    },
    createWorkerSuccess: {
        status: 201,
        description: 'Worker created successfully',
        schema: {
            example: {
                name: 'juab',
                lastName: 'lopez',
                email: 'juan@gmail.com',
                phone: '59903453553',
                rut: 'c343434f34f434',
                key_word: 'cafecito',
                credential: 'c343434f34f434.cafecito',
                type: 'worker',
                ep: 'worker',
            },
        },
    },
    createWorkerConflict: {
        status: 200,
        description: 'The worker already exists',
        schema: {
            example: {
                ok: false,
                message: 'The worker already exists',
            },
        },
    },
    createWorkerBadRequest: {
        status: 400,
        description: 'Bad request',
    },
    listEmployeeSuccess: {
        status: 200,
        description: 'List of employees retrieved successfully',
        schema: {
            example: [
                {
                    name: 'juab',
                    lastName: 'lopez',
                    email: 'juan@gmail.com',
                    phone: '59903453553',
                    rut: 'c343434f34f434',
                    key_word: 'cafecito',
                    credential: 'c343434f34f434.cafecito',
                    type: 'manager/worker',
                    ep: 'manager/worker',
                },
                {},
            ],
        },
    },
    listEmployeeBadRequest: {
        status: 400,
        description: 'Bad request',
    },
    updateEmployeeSuccess: {
        status: 200,
        description: 'Employee information updated successfully',
        schema: {
            example: {
                ok: true,
                message: 'Updated employee information: gjd73j3jnsd84yhds73',
            },
        },
    },
    updateEmployeeBadRequest: {
        status: 400,
        description: 'Bad request',
    },
};
