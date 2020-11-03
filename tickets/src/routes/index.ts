import express, {Request, Response} from "express"
import {Ticket} from "../models/ticket"

const router = express.Router()

router.get("/api/tickets", async (req: Request, res: Response) => {
    const tickets = await Ticket.find({}) //пустой объект обозначает найти все тикеты в коллекции

    res.send(tickets)
})

export {router as indexTicketRouter}