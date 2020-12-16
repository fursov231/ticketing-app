import Stripe from "stripe" //goal Stripe to create a library instance and export it

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: "2020-08-27",
})
