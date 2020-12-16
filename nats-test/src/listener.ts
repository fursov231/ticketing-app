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



process.on("SIGINT", () => stan.close()) //Handler for monitor signal interruption
process.on("SIGTERM", () => stan.close()) // --//-- for terminate
// Triggered on restart or ctrl+c
// Node-nats-server tells the client not to listen events anymore because client closed the connection
// Next stan.on(close) will work, this graceful shutdown necessary to immediately close the subscription (not after 30 sec)



