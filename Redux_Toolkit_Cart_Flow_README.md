# 🛒 Redux Toolkit Cart Demo — Full Code Flow (What Triggers What)

This README explains the **complete flow of the app** (Vite + React + Redux Toolkit) so you can teach it live and always know **which file to open** at each moment.

It covers:
- ✅ Folder structure + what each file does  
- ✅ How UI gets product data (API → thunk → store → UI)  
- ✅ What happens when you click **Add to cart**, **+**, **-**, **Remove**, **Clear cart**  
- ✅ Which reducers/actions/selectors run, and which components re-render  

---

## 📁 Folder Structure (Start Here)

Open this structure first while explaining the project:

```text
src/
  app/
    store.js
  features/
    cart/
      cartSlice.js
      cartSelectors.js
    products/
      productsSlice.js
  components/
    Header.jsx
    Products.jsx
    Cart.jsx
  App.jsx
  main.jsx
  index.css
```

### What each folder means (big idea)

- `app/` 👉 app-level wiring (Redux store setup)  
- `features/` 👉 feature logic (Redux slices + selectors)  
- `components/` 👉 UI screens/widgets that read state + dispatch actions  
- root files (`App.jsx`, `main.jsx`) 👉 app entry + layout  

---

## 🧭 Recommended Lecture Navigation (Which files to open in order)

When teaching live, open files in this order:

1. `src/main.jsx` → shows Provider wrapping the app  
2. `src/app/store.js` → shows single store setup  
3. `src/App.jsx` → shows UI layout (Products + Cart)  
4. `src/features/products/productsSlice.js` → shows async fetch flow  
5. `src/components/Products.jsx` → shows dispatch(fetchProducts) + Add to cart  
6. `src/features/cart/cartSlice.js` → shows reducers for cart operations  
7. `src/features/cart/cartSelectors.js` → shows derived values  
8. `src/components/Cart.jsx` → shows + / - / remove / clear cart triggers  
9. `src/components/Header.jsx` → shows cart count updating via selector  

---

## 🚀 App Boot Flow (What Happens When App Starts)

### 1) Entry Point: `src/main.jsx`

This is the first file that runs.

What happens here:
- React mounts the app  
- Redux store is provided to the entire React tree using `<Provider store={store}>`  

✅ Key takeaway:  
If Provider is not wrapping the app, `useDispatch()` and `useSelector()` won’t work.

---

### 2) Store Setup: `src/app/store.js`

This file creates the Redux store using `configureStore`.

What it does:
- Combines feature reducers:
  - `cart: cartReducer`
  - `products: productsReducer`
- Creates the “single source of truth” state tree.

Resulting state shape (conceptually):

```text
{
  cart: { items: {...} },
  products: { entities: [], status: "idle", error: null }
}
```

✅ Key takeaway:  
The store holds current runtime state values.  
Slices define the rules for updates.

---

### 3) UI Layout: `src/App.jsx`

App renders:
- `<Header />`
- `<Products />`
- `<Cart />`

So Products and Cart are visible at the same time (two panels).

✅ Key takeaway:  
Both panels read from the same Redux store.  
That’s why changes in Products appear instantly in Cart.

---

## 🌐 Product Data Flow (API → Redux → UI)

This explains exactly how product data reaches the UI.

### 4) Async Logic: `src/features/products/productsSlice.js`

This file defines the thunk:
- `fetchProducts` is created using `createAsyncThunk`
- It calls the API: `https://fakestoreapi.com/products`
- It returns simplified product objects: `{ id, title, price, image }`

Redux Toolkit automatically produces 3 action types:

```text
products/fetchProducts/pending
products/fetchProducts/fulfilled
products/fetchProducts/rejected
```

And updates state like this:
- pending → `status = "loading"`
- fulfilled → `status = "succeeded"`, fill `entities`
- rejected → `status = "failed"`, set `error`

✅ Key takeaway:  
This is why our UI can show loading/error states predictably.

---

### 5) UI Fetch Trigger: `src/components/Products.jsx`

This is where the fetch actually starts.

On mount:
- A `useEffect()` runs
- If `status === "idle"`, it dispatches `fetchProducts()`

So:

```text
Products.jsx mounts
  ↓
useEffect runs
  ↓
dispatch(fetchProducts())
  ↓
productsSlice handles pending/fulfilled/rejected
  ↓
Products.jsx re-renders based on status/entities
```

What shows on screen?
- If loading → "Loading products..."
- If failed → error message + retry button
- If succeeded → product cards rendered from `entities`

✅ Key takeaway:  
UI always reflects Redux state.  
Redux state changes → UI updates automatically.

---

## 🛒 Cart Update Flow (Clicks → actions → reducers → UI)

Now we explain what happens when the user interacts with the cart.

---

## ✅ When You Click “Add to cart” (Products panel)

Where click happens:
📍 `src/components/Products.jsx`

Each product card has a button that dispatches:

```text
dispatch(addToCart(product))
```

What triggers next:
📍 `src/features/cart/cartSlice.js`

Reducer `addToCart` runs:
- If product exists in `items` → increment `qty`
- Else create a new entry with `qty = 1`

State changes from:

```text
items = {}
```

to:

```text
items = {
  101: { id: 101, title: "Shoes", price: 50, image: "...", qty: 1 }
}
```

What UI updates:
- `Cart.jsx` re-renders because it selects cart items
- `Header.jsx` re-renders because it selects total item count
- Subtotal and totals update via selectors

✅ Key takeaway:  
One click updates multiple components because they subscribe to the same store.

---

## ➕ When You Click “+” (Increment Qty)

Where click happens:
📍 `src/components/Cart.jsx`

Clicking + dispatches:

```text
dispatch(incrementQty(productId))
```

What triggers next:
📍 `src/features/cart/cartSlice.js`

Reducer `incrementQty` runs:

```text
items[id].qty += 1
```

What UI updates:
- Cart row qty changes
- Line total changes
- Subtotal changes
- Header count changes

✅ Key takeaway:  
“+” is not `addToCart`; it is `incrementQty`.  
Both increase qty, but they come from different UI locations.

---

## ➖ When You Click “-” (Decrement Qty)

Where click happens:
📍 `src/components/Cart.jsx`

Clicking - dispatches:

```text
dispatch(decrementQty(productId))
```

What triggers next:
📍 `src/features/cart/cartSlice.js`

Reducer `decrementQty` runs:
- Decreases qty
- If qty becomes 0 → removes item automatically (teachable rule)

What UI updates:
- If qty > 0 → qty decreases
- If qty hits 0 → row disappears
- Subtotal + header count update

✅ Key takeaway:  
Removing item at qty 0 keeps state clean and avoids having items with qty 0.

---

## 🗑️ When You Click “Remove”

Where click happens:
📍 `src/components/Cart.jsx`

Dispatches:

```text
dispatch(removeFromCart(productId))
```

What triggers next:
📍 `src/features/cart/cartSlice.js`

Reducer removes item key from `items`.

What UI updates:
- Row disappears immediately
- Totals update

---

## 🧹 When You Click “Clear cart”

Where click happens:
📍 `src/components/Cart.jsx`

Dispatches:

```text
dispatch(clearCart())
```

What triggers next:
📍 `src/features/cart/cartSlice.js`

Reducer resets:

```text
items = {}
```

What UI updates:
- Cart becomes empty view
- Totals become 0
- Header count becomes 0

---

## 🧮 Where Subtotal & Total Items Come From (Selectors)

📍 `src/features/cart/cartSelectors.js`

We do NOT store subtotal or total-items in Redux state.

Instead we compute them:
- Total items = sum of qty
- Subtotal = sum(price × qty)

These selectors are used in:
- `Header.jsx` (total item count)
- `Cart.jsx` (subtotal + total items)

✅ Key takeaway:  
Redux state should store the source of truth (items).  
Derived values should be computed from it.

---

## 🔄 Why UI Re-renders (What React-Redux is doing)

Every component that uses `useSelector()` subscribes to Redux.

When an action changes the store:
- React-Redux runs selectors again  
- If selected value changed → component re-renders  

Example:
- `Header.jsx` subscribes to totalItems selector  
- `Cart.jsx` subscribes to items array + subtotal selector  
- `Products.jsx` subscribes to products entities/status  

✅ Key takeaway:  
Re-render happens because the selected values changed, not because Redux “forces” render.

---

## ✅ Summary: “What Triggers What” (Quick Cheat Sheet)

```text
App start:
main.jsx → Provider(store) → App.jsx renders

Fetch products:
Products.jsx mounts → dispatch(fetchProducts)
productsSlice: pending/fulfilled/rejected
Products.jsx re-renders from products state

Add to cart:
Products.jsx button → dispatch(addToCart(product))
cartSlice updates items
Cart.jsx + Header.jsx re-render

Increment:
Cart.jsx "+" → dispatch(incrementQty(id))
cartSlice increments qty
Cart.jsx + Header.jsx re-render

Decrement:
Cart.jsx "-" → dispatch(decrementQty(id))
qty decreases; if 0 remove
Cart.jsx + Header.jsx re-render

Remove:
Cart.jsx remove → dispatch(removeFromCart(id))
item deleted
Cart.jsx + Header.jsx re-render

Clear:
Cart.jsx clear → dispatch(clearCart())
items reset {}
Cart.jsx + Header.jsx re-render
```

---

## 🧑‍🏫 Teaching Tip (Works Really Well)

While explaining, repeatedly emphasize:

- UI dispatches events  
- Reducers update state  
- Selectors compute derived values  
- React re-renders based on store changes  

That’s the full mental model.
