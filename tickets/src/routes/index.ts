import express, {Request, Response} from "express"
import {Ticket} from "../models/ticket"

const router = express.Router()

router.get("/api/tickets", async (req: Request, res: Response) => {
    const tickets = await Ticket.find({
        orderId: undefined
    }) //пустой объект обозначает найти все тикеты в коллекции, orderId: undefined означает пока еще не сделан заказ на этот тикет
    res.send(tickets)
})

export {router as indexTicketRouter}