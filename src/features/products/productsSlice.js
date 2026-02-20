import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();

      // Keep only what we need for the demo
      return data.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image,
      }));
    } catch (err) {
      return rejectWithValue(err?.message || "Unknown error");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    entities: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entities = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load products";
      });
  },
});

export default productsSlice.reducer;