import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // items keyed by productId: { id, title, price, image, qty }
  items: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const p = action.payload; // {id,title,price,image}
      if (!p?.id) return;

      if (state.items[p.id]) {
        state.items[p.id].qty += 1;
      } else {
        state.items[p.id] = {
          id: p.id,
          title: p.title,
          price: p.price,
          image: p.image,
          qty: 1,
        };
      }
    },

    incrementQty: (state, action) => {
      const id = action.payload;
      if (state.items[id]) state.items[id].qty += 1;
    },

    decrementQty: (state, action) => {
      const id = action.payload;
      if (!state.items[id]) return;

      state.items[id].qty -= 1;

      // If qty hits 0, remove automatically (as in the lecture)
      if (state.items[id].qty <= 0) {
        delete state.items[id];
      }
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      delete state.items[id];
    },

    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const {
  addToCart,
  incrementQty,
  decrementQty,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;