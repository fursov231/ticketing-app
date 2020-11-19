import mongoose from "mongoose"
import request from "supertest"
import {app} from "../../app"
import {Order, OrderStatus} from "../../models/order"
import {Ticket} from "../../models/ticket"
import {natsWrapper} from "../../nats-wrapper"

it("returns an error if the ticket doesn`t exist", async () => {
    const ticketId = mongoose.Types.ObjectId() //generate random ID

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({
            ticketId
        })
        .expect(404)

})

it("returns an error if the ticket is already reserved", async () => {
    const ticket = Ticket.build({
        title: "Avengers",
        price: 1000
    })
    await ticket.save()

    const order = Order.build({
        ticket,
        userId: "qwertyuiop",
        status: OrderStatus.Created,
        expiresAt: new Date()
    })
    await order.save()

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(400)
})

it("reserves a ticket", async () => {
    const ticket = Ticket.build({
        title: "Avengers",
        price: 1000
    })
    await ticket.save()

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201)
})

it("emits an order created event", async () => {
    const ticket = Ticket.build({
        title: "Avengers",
        price: 1000
    })
    await ticket.save()

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
