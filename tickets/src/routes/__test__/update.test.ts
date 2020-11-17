import request from "supertest"
import {app} from "../../app"
import mongoose from "mongoose"
import {natsWrapper} from "../../nats-wrapper"

it("returns a 404 if the provided ID doesn`t exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", global.signin())
        .send({
            title: "asd",
            price: 23
        })
        .expect(404)

})

it("returns a 401 if the user isn`t authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "asd",
            price: 23
        })
        .expect(401)
})

it("returns a 401 if the user isn`t own of the ticket", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "asd",
            price: 24
        })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", global.signin()) //генерация нового id
        .send({
            title: "asdf",
            price: 25
        })
        .expect(401)

})

it("returns a 400 if the user provided invalid title of price", async () => {
    const cookie = global.signin()

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)//без генерации нового id
        .send({
            title: "asd",
            price: 24
        })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 10
        })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "new title",
            price: -10
        })
})

it("updates the ticket provided valid inputs", async () => {
    const cookie = global.signin()

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "valid title",
            price: 24
        })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "Show",
            price: 100
        })
        .expect(200)

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
    expect(ticketResponse.body.title).toEqual("Show")
    expect(ticketResponse.body.price).toEqual(100)
})

it("publishes an event", async () => {
    const cookie = global.signin()

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "valid title",
            price: 24
        })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "Show",
            price: 100
        })
        .expect(200)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})

