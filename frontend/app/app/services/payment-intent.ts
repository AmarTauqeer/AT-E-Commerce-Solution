'use server'
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

async function StripePayment(amount:number) {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount:amount,
            currency:"eur",
            automatic_payment_methods:{enabled:true},
        })
        console.log('stripe payment')
        
        return paymentIntent.client_secret;
    } catch (error) {
        console.log(error)
        return error
    }
}

export default StripePayment
