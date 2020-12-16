import nats from "node-nats-streaming"
import {TicketCreatedPublisher} from "./events/ticket-created-publisher"

console.clear()

const stan = nats.connect("ticketing", "Publisher", {
    url: "http://localhost:4222"
}) //client instance for communication with NATS server


stan.on("connect", async () => { //This func will be executed after successfully connecting connecting to the NATS streaming server
    console.log("Publisher connected to NATS")

    const publisher = new TicketCreatedPublisher(stan)
    try {
        await publisher.publish({
            id: "111",
            title: "hank",
            price: 100
        })
    } catch (err) {
        console.error(err)
    }

})

