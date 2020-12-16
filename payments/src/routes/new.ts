import express, {Request, Response} from "express"
import {body} from "express-validator"
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError,
    NotAuthorizedError,
    OrderStatus
} from "@vkassa/common"
import {stripe} from "../stripe"
import {Order} from "../model/order"
import {Payment} from "../model/payment"
import {PaymentCreatedPublisher} from "../events/publishers/payment-created-publisher"
import {natsWrapper} from "../nats-wrapper"

const router = express.Router()

router.post("/api/payments", requireAuth, [
        body("token")
            .not()
            .isEmpty(),
        body("orderId")
            .not()
            .isEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {token, orderId} = req.body

        const order = await Order.findById(orderId)

        if (!order) {
            throw new NotFoundError()
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError()
        }
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError("Can not pay for an cancelled order")
        }

        const charge = await stripe.charges.create({
            currency: "usd",
            amount: order.price * 100, // cents
            source: token //where the money will come
        })

        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        })
        await payment.save()
        await new PaymentCreatedPublisher(natsWrapper.client).publish({ //Use await so as no to go directly to res.status
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        })

        res.status(201).send({id: payment.id})

    })

export {router as createChargeRouter}