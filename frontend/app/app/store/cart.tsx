import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ProductState {
    id: number,
    quantity: number,
    price: number,
    total_price: number,
    product_name: string,
    image_path: string,
}


const cartSlice = createSlice({
    name: 'cart',
    initialState: [] as ProductState[],
    reducers: {
        rehydrateCart: (state) => {
            const savedCart = localStorage.getItem('products');
            if (savedCart) {
                const jsonData = JSON.parse(savedCart)
                if (jsonData.length > 0) {
                    for (let i = 0; i < jsonData.length; i++) {
                        const element = jsonData[i];
                        state.push(element)
                    }
                }
            }
        },
        addToCart(state, action: PayloadAction<any>) {
            const { id, quantity, price, total_price, product_name, image_path } = action.payload;
            const indexProductId = (state).findIndex(item => item.id === id);
            if (indexProductId != -1) {
                state[indexProductId].quantity += quantity;
            } else {
                state.push({ id, quantity, price, total_price, product_name, image_path })
            }
            localStorage.setItem("products", JSON.stringify(state))
        },
        removeFromCart(state, action: PayloadAction<number>) {
            const index = state.findIndex((product) => product.id === action.payload);
            if (index >= 0) {
                state.splice(index, 1);
            }
        },
        changeQuantity(state, actions) {
            const { id, quantity } = actions.payload;
            const indexProductId = state.findIndex((product) => product.id === id);
            if (quantity > 0) {
                state[indexProductId].quantity = quantity;
            } else {
                state = state.filter(product => product.id !== id)
            }
            localStorage.setItem("products", JSON.stringify(state))
        },
        resetCart: (state) => {
            localStorage.removeItem("products")
            return [];

        },
    }
})

export const { addToCart, rehydrateCart, removeFromCart, changeQuantity, resetCart } = cartSlice.actions
export default cartSlice.reducer; 