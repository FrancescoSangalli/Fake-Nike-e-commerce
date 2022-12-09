import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
    cartState: false,
    cartItems: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
    cartTotalAmount: 0,
    cartTotalQuantity: 0
};

const CartSlice = createSlice({
    initialState,
    name: "cart",
    reducers: {
        setOpenCart: (state, action) => {
            //To update initial state
            state.cartState = action.payload.cartState;
        },
        setCloseCart: (state, action) => {
            state.cartState = action.payload.cartState;
        },
        setAddItemToCart: (state, action) => {
            //To modify quantity without adding the same product to chart
            const itemIndex = state.cartItems.findIndex(item => item.id === action.payload.id);

            if (itemIndex >= 0) {
                state.cartItems[itemIndex].cartQuantity += 1;
                //Notification
                toast.success(`Item QTY increased`);
            } else {
                const temp = { ...action.payload, cartQuantity: 1 };
                state.cartItems.push(temp);
                //Notification
                toast.success(`${action.payload.title} added to cart`);
            }

            //Save items added to the cart in localstorage
            localStorage.setItem("cart", JSON.stringify(state.cartItems));
        },
        setRemoveItemFromCart: (state, action) => {
            const removeItem = state.cartItems.filter(item => item.id !== action.payload.id);
            state.cartItems = removeItem;
            localStorage.setItem("cart", JSON.stringify(state.cartItems));
            toast.success(`${action.payload.title} Removed From Cart`);
        },
        setIncreaseItemQTY: (state, action) => {
            //To modify quantity without adding the same product to chart
            const itemIndex = state.cartItems.findIndex(item => item.id === action.payload.id);

            if (itemIndex >= 0) {
                state.cartItems[itemIndex].cartQuantity += 1;
                //Notification
                toast.success(`Item QTY increased`);
            }

            localStorage.setItem("cart", JSON.stringify(state.cartItems));

        },
        setDecreaseItemQTY: (state, action) => {
            //To modify quantity without adding the same product to chart
            const itemIndex = state.cartItems.findIndex(item => item.id === action.payload.id);

            if (state.cartItems[itemIndex].cartQuantity > 1) {
                state.cartItems[itemIndex].cartQuantity -= 1;
                //Notification
                toast.success(`Item QTY decreased`);
            }

            localStorage.setItem("cart", JSON.stringify(state.cartItems));
        },
        setClearCartItems: (state, action) => {
            state.cartItems = [];
            toast.success(`Cart Cleared`);
            localStorage.setItem("cart", JSON.stringify(state.cartItems));
        },
        //Define total amount and total quantity
        setGetTotals: (state, action) => {
            //Reduce methot return two object at once
            let { totalAmount, totalQTY } = state.cartItems.reduce((cartTotal, cartItem) => {
                //Price and carQuantity are attribute of the item
                const { price, cartQuantity } = cartItem;
                const totalPrice = price * cartQuantity;

                cartTotal.totalAmount += totalPrice;
                cartTotal.totalQTY += cartQuantity;
                return cartTotal;
            }, {
                //Initial value
                totalAmount: 0,
                totalQTY: 0
            });

            state.cartTotalAmount = totalAmount;
            state.cartTotalQuantity = totalQTY;
        }
    }
});

export const {
    setOpenCart, 
    setCloseCart, 
    setAddItemToCart, 
    setRemoveItemFromCart, 
    setIncreaseItemQTY, 
    setDecreaseItemQTY, 
    setClearCartItems,
    setGetTotals
} = CartSlice.actions;
export const selectCartState = state => state.cart.cartState;
export const selectCartItems = state => state.cart.cartItems;
export const selectTotalAmount = state => state.cart.cartTotalAmount;
export const selectTotalQTY = state => state.cart.cartTotalQuantity;
export default CartSlice.reducer;