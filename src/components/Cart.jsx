import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItemsArray,
  selectCartSubtotal,
  selectCartTotalItems,
} from "../features/cart/cartSelectors";
import {
  clearCart,
  decrementQty,
  incrementQty,
  removeFromCart,
} from "../features/cart/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItemsArray);
  const subtotal = useSelector(selectCartSubtotal);
  const totalItems = useSelector(selectCartTotalItems);

  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Cart</h2>
        <p className="muted">
          Derived values via selectors (total items + subtotal)
        </p>
      </div>

      <div className="cartSummary">
        <div>
          <div className="label">Items</div>
          <div className="value">{totalItems}</div>
        </div>
        <div>
          <div className="label">Subtotal</div>
          <div className="value">${subtotal.toFixed(2)}</div>
        </div>
        <button
          className="btn danger"
          onClick={() => dispatch(clearCart())}
          disabled={items.length === 0}
          title={items.length === 0 ? "Cart is empty" : "Clear all items"}
        >
          Clear cart
        </button>
      </div>

      {items.length === 0 ? (
        <div className="notice">Your cart is empty. Add a product 👈</div>
      ) : (
        <div className="cartList">
          {items.map((i) => (
            <div key={i.id} className="cartRow">
              <img className="cartThumb" src={i.image} alt={i.title} />

              <div className="cartInfo">
                <div className="cartTitle" title={i.title}>
                  {i.title}
                </div>
                <div className="muted">
                  ${i.price.toFixed(2)} each
                </div>
              </div>

              <div className="qtyControls">
                <button
                  className="btn small"
                  onClick={() => dispatch(decrementQty(i.id))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <div className="qty">{i.qty}</div>

                <button
                  className="btn small"
                  onClick={() => dispatch(incrementQty(i.id))}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="lineTotal">
                ${(i.qty * i.price).toFixed(2)}
              </div>

              <button
                className="btn small ghost"
                onClick={() => dispatch(removeFromCart(i.id))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}