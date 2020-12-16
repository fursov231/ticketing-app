export const natsWrapper = { // fake publish func for testing events in route handler
    client: {
        publish: jest.fn().mockImplementation(
            (subject: string, data: string, callback: () => void) => {
                callback()
            }
        )
    }
}