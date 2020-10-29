import supertest from "supertest"
import {app} from "../../app"
import request from "supertest";

it("fails when email does not exist in supplied", async () => {
    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "ssss@ssllls.dd",
            password: "1dfsdfgsd"
        })
        .expect(400)
})

it("fails when incorrect password is supplied ", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "ssss@ssllls.dd",
            password: "1dfsdfgsd"
        })
        .expect(201)

    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "ssss@ssllls.dd",
            password: "1dfsdfsd"
        })
        .expect(400)
})

it("response with a cookie when given valid credentials", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "ssss@ssllls.dd",
            password: "1dfsdfgsd"
        })
        .expect(201)

    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "ssss@ssllls.dd",
            password: "1dfsdfgsd"
        })
        .expect(200)
    expect(response.get("Set-Cookie")).toBeDefined()
})

