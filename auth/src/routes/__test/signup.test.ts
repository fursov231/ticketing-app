import request from "supertest"
import {app} from "../../app"

it("returns 201 on successful signup", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "jjj@mail.ru",
            password: "12233ds"
        })
        .expect(201)
})

it("returns 400 with an invalid email", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "ssss",
            password: "14redrd"
        })
        .expect(400)
})

it("returns 400 with an invalid password", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "ssss@sss.dd",
            password: "1"
        })
        .expect(400)
})

it("disallows diplicate emails", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "sss@sss.ru",
            password: "ss7s"
        })
        .expect(201)

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "sss@sss.ru",
            password: "sss"
        })
        .expect(400)
})

it("sets a cookie after successful signup", async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "ssss@ssllls.dd",
            password: "1dfsdfgsd"
        })
        .expect(201)
    expect(response.get("Set-Cookie")).toBeDefined()
})
