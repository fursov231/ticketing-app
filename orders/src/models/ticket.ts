import mongoose from "mongoose"
import {Order, OrderStatus} from "./order"
import {updateIfCurrentPlugin} from "mongoose-update-if-current"

interface TicketAttrs {
    id: string
    title: string
    price: number
}

export interface TicketDoc extends mongoose.Document {
    title: string
    version: number
    price: number

    isReserved(): Promise<Boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
    findByEvent(event: {id: string, version: number}): Promise<TicketDoc> | null // Event search method interface
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

ticketSchema.set("versionKey", "version")
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.findByEvent = (event: {id: string, version: number}) => { // Event search method
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    })
}
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id, //For the same ID in different services
        title: attrs.title,
        price: attrs.price
    })
}
ticketSchema.methods.isReserved = async function () {
//This === the ticket document that we just called "isReserved" on
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [ //MongoDB operator looking for a set of values
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    })
    return !!existingOrder //False if there are no existing orders
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema)

export {Ticket}