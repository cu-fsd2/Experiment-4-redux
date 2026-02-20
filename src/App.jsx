import Header from "./components/Header";
import Products from "./components/Products";
import Cart from "./components/Cart";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="layout">
        <Products />
        <Cart />
      </main>

      <footer className="footer">
        <span className="muted">
          Redux Toolkit demo: dispatch → reducer → new state → UI re-render
        </span>
      </footer>
    </div>
  );
}