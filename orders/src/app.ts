import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import {currentUser, errorHandler, NotFoundError} from '@vkassa/common'
import {deleteOrderRouter} from "./routes/delete"
import {showOrderRouter} from "./routes/show"
import {indexOrderRouter} from "./routes/index"
import {newOrderRouter} from "./routes/new"

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: false
  })
)
app.use(currentUser) //для вызова requireAuth и др. middleware`ов в route`е
app.use(deleteOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)
app.use(newOrderRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app };
