import nats from "node-nats-streaming"
import {TicketCreatedPublisher} from "./events/ticket-created-publisher"

console.clear()

const stan = nats.connect("ticketing", "Publisher", {
    url: "http://localhost:4222"
}) //принятое название переменной, инстанс клиента для коммуникации с nats server


stan.on("connect", async () => { //эта функция выполнится после успешного подключения к nats streaming server
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

    /*
        const data = JSON.stringify({
            id: "111",
            title: "new",
            price: 20
        })

        stan.publish("ticket:created", data, () => {
            console.log("Event published")
        })*/
})

