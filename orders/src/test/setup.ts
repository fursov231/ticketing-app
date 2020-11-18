import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken"

declare global {
    namespace NodeJS {
        interface Global {
            signin(): string[]
        }
    }
}

jest.mock("../nats-wrapper") //фейк клиент, чтобы не устанавливать соединение с настоящим NATS сервером при тестировании

let mongo: any;
beforeAll(async () => {
    jest.clearAllMocks()
    process.env.JWT_KEY = "jwt-secret";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections() //берем все коллекции в mongoDB

    for (let collection of collections) {
        await collection.deleteMany({}) //и удаляем каждую из них
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = () => {
    //Build a jwt payload {id, email}
    const payload = {

        id: new mongoose.Types.ObjectId().toHexString(),
        email: "test@test.com"
    }
    //Create the jwt
    const token = jwt.sign(payload, process.env.JWT_KEY!)
    //Build session Object {jwt: my_jwt)
    const session = {jwt: token}
    //Turn that session into JSON
    const sessionJSON = JSON.stringify(session)
    //Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64")
    //return a string that the cookie with the encoded data
    return [`express:sess=${base64}`]
}
