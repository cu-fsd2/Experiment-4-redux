import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productsSlice";
import { addToCart } from "../features/cart/cartSlice";

export default function Products() {
  const dispatch = useDispatch();
  const { entities, status, error } = useSelector((s) => s.products);

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [status, dispatch]);

  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Products</h2>
        <p className="muted">Async loaded (pending / fulfilled / rejected)</p>
      </div>

      {status === "loading" && <div className="notice">Loading products…</div>}
      {status === "failed" && (
        <div className="notice error">
          Failed: {error}{" "}
          <button className="btn small" onClick={() => dispatch(fetchProducts())}>
            Retry
          </button>
        </div>
      )}

      {status === "succeeded" && (
        <div className="grid">
          {entities.map((p) => (
            <article key={p.id} className="card">
              <div className="thumbWrap">
                <img className="thumb" src={p.image} alt={p.title} />
              </div>
              <div className="cardBody">
                <div className="cardTitle" title={p.title}>
                  {p.title}
                </div>
                <div className="row">
                  <div className="price">${p.price.toFixed(2)}</div>
                  <button
                    className="btn"
                    onClick={() => dispatch(addToCart(p))}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}