import mongoose from "mongoose"
import {Password} from "../services/password"

interface UserAttrs {
    email: string
    password: string
}
//Properties of User Model. Model - entire collection of data
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}
//Properties of User Document. Represent one single record
interface UserDoc extends mongoose.Document {
    email: string,
    password: string
}
//All properties that we want it
const userSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        }
    }, {
        toJSON: {
            transform(doc, ret) { //doc - object of deletion, ret - what we change to delete data in response
                ret.id = ret._id
                delete ret._id
                delete ret.password
                delete ret.__v
            }
        }
    }
)

//Pre hook needed to hash the password
userSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashed = await Password.toHash(this.get("password"))
        this.set("password", hashed)
    }
    done()
})
//Function needed for typescript (for validation properties when creating new record)
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>("User", userSchema)

export {User}