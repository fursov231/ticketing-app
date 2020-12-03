import Stripe from "stripe" //цель stripeTs.ts создать инстанс библиотеки и экспортировать его

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: "2020-08-27",
})
