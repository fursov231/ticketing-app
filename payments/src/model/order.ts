import mongoose from "mongoose"
import {OrderStatus} from "@vkassa/common"
import {updateIfCurrentPlugin} from "mongoose-update-if-current"

interface OrderAttrs {
    id: string
    status: OrderStatus
    version: number
    userId: string
    price: number

}

interface OrderDoc extends mongoose.Document {
    status: OrderStatus
    version: number
    userId: string
    price: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
}

const orderShema = new mongoose.Schema({
        userId: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        status: {
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
    }
)

orderShema.set("versionKey", "version") //Replaces __v with version
orderShema.plugin(updateIfCurrentPlugin)

orderShema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status
    })
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderShema)

export {Order}
