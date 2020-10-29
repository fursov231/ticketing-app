import request from "supertest"
import {app} from "../../app"

it ("responds with details about current user", async () => {
    await request(app)
        .get("/api/users/currentuser")
        .send({
            email: "test1@test.com",
            password: "test1"
        })
        .expect(200)

    const cookie = await global.signin()

    const response = await request (app)
        .get("/api/users/currentuser")
        .set("Cookie", cookie)
        .send()
        .expect(200)
    console.log(response.body)
    expect(response.body.currentUser.email).toEqual("test1ы@test.com")
})

it ("responds with null if user is not authenticated", async () => {
    const response = await request(app)
        .get("/api/users/currentuser")
        .send()
        .expect(200)
    expect(response.body.currentUser).toEqual(null)
})