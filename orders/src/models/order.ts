import mongoose from "mongoose"
import {OrderStatus} from "@vkassa/common"
import {TicketDoc} from "./ticket"
import {updateIfCurrentPlugin} from "mongoose-update-if-current"

export {OrderStatus}

//Describe the properties that are used to create a user or record
interface OrderAttrs {
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket: TicketDoc
}

//Describe the properties of the saved documents
interface OrderDoc extends mongoose.Document {
    userId: string
    version: number
    status: OrderStatus
    expiresAt: Date
    ticket: TicketDoc
}

//2 interfaces are used because the props that are needed to create the order may differ from the props in the final order
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

orderSchema.set("versionKey", "version")
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema)

export {Order}