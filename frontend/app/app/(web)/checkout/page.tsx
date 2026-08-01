'use client'

import React, { useEffect, useState } from 'react'

import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js'
import { toast } from 'sonner'
import convertToSubcurrency from '../../lib/convert-to-subcurrency'
import { Button } from '@/components/ui/button'
import StripePayment from '../../services/payment-intent'

interface ProductState {
    id: number,
    quantity: number,
    price: number,
    total_price: number,
    product_name: string,
    image_path: string,
}[]

type dataProps = {
    data: ProductState[]
}


const Checkout = ({ data }: dataProps) => {

    const [errorMessage, setErrorMessage] = useState<string>()
    const [total, setTotal] = useState(1)
    const [clientSecret, setClientSecret] = useState("")
    const [loading, setLoading] = useState(false)
    const elements = useElements()
    const stripe = useStripe()

    useEffect(() => {
        if (data) {
            let sum = 0;
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                const subTotal = element.quantity * element.price;
                sum += subTotal
            }
            setTotal(sum)
            const getStripeData = async (sum: number) => {
                const response = await StripePayment(convertToSubcurrency(sum))
                // console.log(response)
                if (response) {
                    // console.log(response)
                    setClientSecret(response)
                }
            }
            getStripeData(sum)
        }


    }, [data])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        if (!stripe || !elements) {
            return
        }

        const { error: submitError } = await elements.submit()

        if (submitError) {
            setErrorMessage(submitError.message)
            setLoading(false)
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `https://at-ecommerce-solution.vercel.app/order-confirm?data=${JSON.stringify(data)}`
            }
        })

        if (error) {
            console.log(error.message)
            toast.error(error.message)
            setErrorMessage(error.message)
            setLoading(false)
        }
        setLoading(false)
    }

    return (
        <>
            <div className='flex items-center min-h-[75vh] mx-auto justify-center'>
                <form onSubmit={handleSubmit} className='mt-2 min-w-96'>

                    {clientSecret && <PaymentElement />}
                    {errorMessage && <div>{errorMessage}</div>}
                    <Button
                        disabled={!stripe || loading}
                        className='w-full mt-2 rounded-md font-bold'
                        type='submit'
                    >
                        {!loading ? `Pay Euro ${total}` : "Processing..."}
                    </Button>
                </form>
            </div>
        </>
    )
}

export default Checkout
