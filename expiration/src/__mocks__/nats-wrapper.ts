export const natsWrapper = {
    client: { // Fake publish function for testing event publishing in the route handler
        publish: jest.fn().mockImplementation(
            (subject: string, data: string, callback: () => void) => {
                callback()
            }
        )
    }
}