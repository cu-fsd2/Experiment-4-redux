import { useSelector } from "react-redux";
import { selectCartTotalItems } from "../features/cart/cartSelectors";

export default function Header() {
  const totalItems = useSelector(selectCartTotalItems);

  return (
    <header className="header">
      <div className="brand">
        <span className="logo">🛒</span>
        <div>
          <div className="title">RTK Cart Demo</div>
          <div className="subtitle">Redux Toolkit Shopping Cart</div>
        </div>
      </div>

      <div className="cartBadge" aria-label="Cart item count">
        <span>Cart</span>
        <span className="pill">{totalItems}</span>
      </div>
    </header>
  );
}