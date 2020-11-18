import mongoose from "mongoose"
import {OrderStatus} from "@vkassa/common"
import {TicketDoc} from "./ticket"

export {OrderStatus}

interface OrderAttrs { // описывает свойства, которые используются для создания юзера или записи
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket: TicketDoc
}

interface OrderDoc extends mongoose.Document { //описывает свойства сохраненного документа
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket: TicketDoc
}

//2 interface`а используются, потому что  свойства которые необходимы для создания заказа могут отличаться от свойств в конечном заказе
interface OrderModel extends mongoose.Model<OrderDoc> { //описывает все свойства, которыми обладает модель в целом
    build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket"
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema)

export {Order}