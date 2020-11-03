import mongoose from "mongoose"
import {Password} from "../services/password"


interface UserAttrs {
    email: string
    password: string
}
//properties of User Model //model - entire collection of data
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}
//properties of User Document //represent one single record
interface UserDoc extends mongoose.Document {
    email: string,
    password: string
}
//all properties that we want it
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
            transform(doc, ret) { //doc - объект удаления, ret - то что изменяем, для удаления данных в response
                ret.id = ret._id
                delete ret._id
                delete ret.password
                delete ret.__v
            }
        }
    }
)

//pre hook нужен для hash`ирования пароля
userSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashed = await Password.toHash(this.get("password"))
        this.set("password", hashed)
    }
    done()
})
//функция нужна для typescript`a, для валидация свойств для создания новой записи
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>("User", userSchema)

export {User}