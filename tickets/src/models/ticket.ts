import mongoose from "mongoose"

interface TicketAttrs {
    title: string,
    price: number
    userId: string
}

interface TicketDoc extends mongoose.Document {
    title: string,
    price: number,
    userId: string
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String, //с большой буквы, т.к. ссылаемся на глобальный конструктор строк в JavaScript
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id

        }
    }
})

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs)
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema)

export {Ticket}