import express from 'express'
import "express-async-errors"
import {json} from 'body-parser'
import cookieSession from "cookie-session"

import {errorHandler, NotFoundError} from "@vkassa/common"

export const app = express()
app.set("trust proxy", true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test" //работа по протоколу https кроме режима тестирования
}))

app.all("/*", async () => {
    throw new NotFoundError()
})

app.use(errorHandler)