import nats from "node-nats-streaming"
import {randomBytes} from "crypto"
import {TicketCreatedListener} from "./events/ticket-created-listener"

console.clear()

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
    url: "http://localhost:4222"
})


stan.on("connect", () => {
    console.log("Listener connected to NATS")

    stan.on("close", () => {
        console.log("NATS connection closed")
        process.exit()
    })

    new TicketCreatedListener(stan).listen()
})



process.on("SIGINT", () => stan.close()) //хендлер для остлеживания прерывания сигнала (interrupt)
process.on("SIGTERM", () => stan.close()) //для прекращения (terminate)
// срабатывают при рестарте или ctrl+c//node-nats-server говорит клиенту не слушай больше ивенты, т.к. клиент закрыл соединение
// далее сработает  stan.on(close), сделано для того, чтобы сразу закрыть subscription а не через 30 сек (graceful shutdown)


