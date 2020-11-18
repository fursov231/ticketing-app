export const natsWrapper = {
    client: { // fake publish функция для тестирования публикации ивентов, этот объект берет route handler
        publish: jest.fn().mockImplementation(
            (subject: string, data: string, callback: () => void) => {
                callback()
            }
        )
    }
}