import request from "supertest"
import {app} from "../../app"

it("clearing the cookie after signing out", async () => {

    await request (app)
        .post("/api/users/signup")
        .send({
            email: "sss@sss.ru",
            password: "1111s"
        })
        .expect(201)

    const response = await request(app)
        .post("/api/users/signout")
        .send({})
        .expect(200)

    expect(response.get("Set-Cookie")[0]).toEqual(
            'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
        )
})

