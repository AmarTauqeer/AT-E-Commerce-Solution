'use client'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useSelector } from 'react-redux'
import convertToSubcurrency from '../../lib/convert-to-subcurrency'
import Checkout from '../checkout/page'

const PaymentWrapper = () => {
    const cartProducts = useSelector((store: any) => store.cart);
   
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
        throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")
    }

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
    return (
        <div>
            <Elements
                stripe={stripePromise}
                options={{
                    mode: "payment",
                    amount: convertToSubcurrency(1000),
                    currency: "eur",
                }}
            >
                <Checkout data={cartProducts} />

            </Elements>
        </div>
    )
}

export default PaymentWrapper
