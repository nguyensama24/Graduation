import axios from "axios"

const appConfig = {
    apiUrl: import.meta.env.VITE_BACKEND_PAYMENT_URL || ''
}

class PaymentControllers {
    createPayment = async (data: any) => {
        return await axios.post(`${appConfig.apiUrl}/create-checkout-session`, data)
    }
}

export const paymentControllers = new PaymentControllers