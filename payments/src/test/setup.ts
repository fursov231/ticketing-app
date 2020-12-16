import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken"

declare global {
    namespace NodeJS {
        interface Global {
            signin(id?: string): string[]
        }
    }
}

jest.mock("../nats-wrapper") //Fake client so as not to establish a connection with the real server during testing

process.env.STRIPE_KEY = "sk_test_51HtzoDBmzZqQ8xaZ3xNFGuXiguZXoAM76MFfOEVE2g9sMjN1HCUGMPaYjfZNF6IhnGuFcagF6LuHuslmzppGnwXk00K2JioY5s"

let mongo: any;
beforeAll(async () => {
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
    jest.clearAllMocks() // .set isn`t reset in tests

    const collections = await mongoose.connection.db.collections() //Get all collections in mongoDB

    for (let collection of collections) {
        await collection.deleteMany({}) //Remove each of them
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    //Build a jwt payload {id, email}
    const payload = {

        id: id || new mongoose.Types.ObjectId().toHexString(),
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

    //Return a string that the cookie with the encoded data
    return [`express:sess=${base64}`]
}
