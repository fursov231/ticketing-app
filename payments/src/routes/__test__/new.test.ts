import request from "supertest"
import {app} from "../../app"
import mongoose from "mongoose"
import {Order} from "../../model/order"
import {OrderStatus} from "@vkassa/common"
import {stripe} from "../../stripe"
import {Payment} from "../../model/payment"

it("returns a 404 when purchasing an order that doesn`t exist", async () => {
    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin())
        .send({
            token: "qwerty",
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)
})

it("returns a 401 when purchasing an order that doesn`t belong to the user", async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 1110,
        status: OrderStatus.Created
    })
    await order.save()

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin())
        .send({
            token: "qwerty",
            orderId: order.id
        })
        .expect(401)
})

it("returns a 400 when purchasing a cancelled order", async () => {
    const userId = mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 1110,
        status: OrderStatus.Cancelled
    })
    await order.save()

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin(userId))
        .send({
            orderId: order.id,
            token: "qwerty"
        })
        .expect(400)
})

it("returns a 201 with valid inputs", async () => {
    const userId = mongoose.Types.ObjectId().toHexString()
    const price = Math.floor(Math.random() * 100000)
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price,
        status: OrderStatus.Created
    })
    await order.save()

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin(userId))
        .send({
            token: "tok_visa", //Works for a strip account in test mode
            orderId: order.id
        })
        .expect(201)

    const stripeCharges = await stripe.charges.list({limit: 50})
    const stripeCharge = await stripeCharges.data.find(charge => {
        return charge.amount === price * 100
    })

    expect(stripeCharge).toBeDefined()
    expect(stripeCharge!.currency).toEqual("usd")

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id
    })

    expect(payment).not.toBeNull()

})