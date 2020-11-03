import express, {Request, Response} from "express"
import {body} from "express-validator"
import {validateRequest, BadRequestError} from "@vkassa/common"
import {Password} from "../services/password"
import {User} from "../models/user";
import jwt from "jsonwebtoken";

const router = express.Router()

router.post('/api/users/signin', [
        body("email")
            .isEmail()
            .withMessage("Email must be valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Your password must be not empty")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {email, password} = req.body
        const existingUser = await User.findOne({email})
        if (!existingUser) {
            throw new BadRequestError("Invalid credentials")
        }

        const passwordsMatch = await Password.compare(existingUser.password, password)

        if (!passwordsMatch) {
            throw new BadRequestError("Invalid credentials")
        }

        //Generate JWT
        const userJwt = jwt.sign({
                user: existingUser.id,
                email: existingUser.email
            }, process.env.JWT_KEY!
        )
        //Store it in a session object
        req.session = {
            jwt: userJwt
        }
        res.status(200).send(existingUser)
    })

export {router as signinRouter}