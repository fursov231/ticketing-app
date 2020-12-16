export const natsWrapper = { // Fake publish function for events publishing testing in route handler
    client: {
        publish: jest.fn().mockImplementation(
            (subject: string, data: string, callback: () => void) => {
                callback()
            }
        )
    }
}