export const helpResponses = {
    createClaimSuccess: {
        status: 201,
        description: 'Claim created successfully',
        schema: {
            example: {
                id: 'ff8s8gsdgs8787s9g7',
                title: 'Mal servicio',
                content: 'Mal servicio por parte de mesero',
                user: 'user',
            },
        },
    },
    createSuggestionSuccess: {
        status: 201,
        description: 'Suggestion created successfully',
        schema: {
            example: {
                id: 'ff8s8gsdgs8787s9g7',
                title: 'Mal servicio',
                content: 'Mal servicio por parte de mesero',
                user: 'user',
            },
        },
    },
    createTicketSuccess: {
        status: 201,
        description: 'Ticket created successfully',
        schema: {
            example: {
                id: 'ff8s8gsdgs8787s9g7',
                title: 'Mal servicio',
                content: 'Mal servicio por parte de mesero',
                user: 'user',
            },
        },
    },
    createBadRequest: {
        status: 400,
        description: 'Bad request',
    },
};
