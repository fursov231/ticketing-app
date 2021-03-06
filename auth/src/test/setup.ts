import {MongoMemoryServer} from "mongodb-memory-server"
import mongoose from "mongoose"
import {app} from "../app"
import request from "supertest"

declare global {
    namespace NodeJS {
        interface Global {
            signin(): Promise<string[]>
        }
    }
}

let mongo: any
beforeAll(async () => {
    //Set variable jwt-secret because the real one is set in the container
    process.env.JWT_KEY = "JWT_KEY"
    mongo = new MongoMemoryServer()
    const mongoUri = await mongo.getUri()

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})

global.signin = async () => {
    const email = "test1@test.com"
    const password = "test1"

    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email, password
        })
        .expect(201)

    const cookie = response.get("Set-Cookie")
    return cookie
}
