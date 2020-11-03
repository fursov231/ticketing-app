import express, {Request, Response} from "express"
import {body} from "express-validator"
import {requireAuth, validateRequest} from "@vkassa/common";
import {Ticket} from "../models/ticket"

const router = express.Router()

router.post("/api/tickets", requireAuth, [
    body("title").not().isEmpty().withMessage("Title is required"), // проверка если строка пустая или ее нету
    body("price").isFloat({gt: 0}).withMessage("Price must be greater then 0") //gt - greater than
], validateRequest,
    async (req: Request, res: Response) => {
    const {title, price} = req.body
    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    })
    await ticket.save()

    res.status(201).send(ticket)
})

export {router as createTicketRouter}