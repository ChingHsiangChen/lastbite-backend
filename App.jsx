import React, { useEffect, useState } from "react";

const TAX_RATE = 0.08875; // 8.875%

const SLIDER_IMAGES = [
  { src: "/Food/duck.jpeg", alt: "Peking Duck" },
  { src: "/Food/Mapo Tofu.jpeg", alt: "Mapo Tofu" },
  { src: "/Food/Noodles.jpeg", alt: "Beef Noodles" },
  { src: "/Food/porkbun.jpeg", alt: "Steamed Pork Buns" },
  { src: "/Food/seafood.jpeg", alt: "Seafood Platter" },
  { src: "/Food/shumai.jpeg", alt: "Shumai Dumplings" },
];

// SMALL REUSABLE PIECES

function Header({ cartCount, onCartOpen }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="bg-dark text-light sticky-top shadow-sm d-flex align-items-center justify-content-between px-3 py-2">
      {/* logo */}
      <div className="d-flex align-items-center gap-2">
        <img
          src="/logo.png"
          alt="LastBite Logo"
          style={{ width: 26, height: 26, objectFit: "contain" }}
        />
        <span className="fw-bold text-warning fs-4">LastBite</span>
      </div>

      {/* nav links */}
      <nav className="d-none d-md-flex gap-3">
        <a href="#home" className="text-warning text-decoration-none">
          Home
        </a>
        <a href="#menu" className="text-warning text-decoration-none">
          Menu
        </a>
        <a href="#about" className="text-warning text-decoration-none">
          About
        </a>
        <a href="#contact" className="text-warning text-decoration-none">
          Contact
        </a>
      </nav>

      {/* right side: cart + hamburger */}
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-warning rounded-pill fw-bold cart-toggle"
          onClick={onCartOpen}
        >
          Your Cart{" "}
          <span
            id="cart-count"
            className="badge bg-dark text-light ms-1"
          >
            {cartCount}
          </span>
        </button>
        <button
          className="btn btn-outline-warning d-md-none hamburger"
          onClick={() => setNavOpen(!navOpen)}
        >
          ☰
        </button>
      </div>

      {/* mobile nav */}
      {navOpen && (
        <nav className="navbar bg-dark position-absolute top-100 start-0 w-100 d-md-none py-2 px-3">
          <a
            href="#home"
            className="d-block text-warning text-decoration-none mb-1"
          >
            Home
          </a>
          <a
            href="#menu"
            className="d-block text-warning text-decoration-none mb-1"
          >
            Menu
          </a>
          <a
            href="#about"
            className="d-block text-warning text-decoration-none mb-1"
          >
            About
          </a>
          <a
            href="#contact"
            className="d-block text-warning text-decoration-none mb-1"
          >
            Contact
          </a>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="hero position-relative text-center">
      <img
        src="/hero.jpeg"
        alt="Restaurant Interior"
        style={{
          width: "100%",
          height: "600px",
          objectFit: "cover",
          filter: "brightness(80%)",
        }}
      />
      <div
        className="hero-text position-absolute top-50 start-50 translate-middle text-light px-4 py-3 rounded-3"
        style={{ background: "rgba(0,0,0,0.45)" }}
      >
        <h1>Welcome to LastBite!!!</h1>
      </div>
    </section>
  );
}

function MenuTable({ title, items, onAdd }) {
  return (
    <>
      <h2 className="mt-5">{title}</h2>
      <table className="menu-table table table-bordered table-hover mx-auto">
        <thead>
          <tr>
            <th>Dish</th>
            <th>Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item._id}
              className="clickable-row"
              onClick={() => onAdd(item._id)}
            >
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>
                ${Number(item.price).toFixed(2)}
                <span
                  style={{
                    color: "#f8b400",
                    fontWeight: 700,
                    marginLeft: 8,
                  }}
                >
                  + Add
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/**
 * Slider SAME AS HW2:
 * - all images in a flex strip
 * - translateX(-index * 100%)
 * - moves only when clicking arrows (no auto)
 */
function Slider() {
  const [index, setIndex] = useState(0);

  const goNext = () => setIndex((i) => (i + 1) % SLIDER_IMAGES.length);
  const goPrev = () =>
    setIndex((i) => (i - 1 + SLIDER_IMAGES.length) % SLIDER_IMAGES.length);

  return (
    <div
      className="slider-container position-relative mx-auto mt-5"
      style={{
        maxWidth: 850,
        height: 500,
        overflow: "hidden",
      }}
    >
      <button className="prev-btn" onClick={goPrev}>
        &#10094;
      </button>

      <div
        className="slider"
        style={{
          display: "flex",
          height: "100%",
          transform: `translateX(-${index * 100}%)`,
          transition: "transform 0.6s ease-in-out",
        }}
      >
        {SLIDER_IMAGES.map((img) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            style={{
              width: "100%",
              flexShrink: 0,
              height: "100%",
              objectFit: "cover",
            }}
          />
        ))}
      </div>

      <button className="next-btn" onClick={goNext}>
        &#10095;
      </button>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="about text-center py-5">
      <h2>About LastBite</h2>
      <p>
        Welcome to <strong>LastBite</strong>, where the timeless traditions of
        Chinese and Japanese cuisine come together under one roof. Our chefs
        honor classic recipes passed down through generations — from handcrafted
        dim sum and wok-fired noodles to delicately prepared sushi and sashimi
        made with the freshest ingredients.
      </p>
      <p>
        At <strong>LastBite</strong>, dining is more than just a meal — it’s an
        experience rooted in culture and craftsmanship. Whether you’re savoring
        the comforting warmth of steamed dumplings or the refined simplicity of
        sushi, every bite celebrates harmony and heritage.
      </p>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact text-center py-5">
      <h2>Find Us</h2>
      <div className="map-container mx-auto" style={{ maxWidth: 900 }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.946245294236!2d-73.98513508459472!3d40.75889677932616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25854cfa83933%3A0xd0f1e82639d58e4f!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1701902468449!5m2!1sen!2sus"
          width="100%"
          height="350"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          title="LastBite Location"
        />
      </div>
      <div className="contact-info mt-3">
        <h3>Contact Information</h3>
        <p>
          <strong>Address:</strong> 11 W 32nd Street, New York, NY 10001
        </p>
        <p>
          <strong>Phone:</strong> (340) 555-8888
        </p>
        <p>
          <strong>Email:</strong> EatWithUs123@lastbite.com
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="text-center py-4"
      style={{ background: "#2c2c2c", color: "#fff" }}
    >
      <p>Follow us:</p>
      <div className="social-icons d-flex justify-content-center gap-3">
        <a
          href="https://www.pinterest.com/search/pins/?q=chinese%20food&rs=typed"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="/fb.png"
            alt="Facebook"
            style={{
              width: 32,
              height: 32,
              filter: "brightness(0) invert(1)",
            }}
          />
        </a>
        <a
          href="https://www.pinterest.com/search/pins/?q=chinese%20food&rs=typed"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="/insta.png"
            alt="Instagram"
            style={{
              width: 32,
              height: 32,
              filter: "brightness(0) invert(1)",
            }}
          />
        </a>
      </div>
      <p>Open Everyday: 10 AM – 10 PM</p>
    </footer>
  );
}

function CartPanel({
  open,
  cart,
  onClose,
  onClear,
  onChangeQty,
  onRemove,
  onCheckout,
}) {
  const subtotal = cart.reduce((acc, i) => acc + i.qty * i.price, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <aside
      id="cart-panel"
      className={`cart-panel ${open ? "open" : ""}`}
      aria-hidden={open ? "false" : "true"}
      style={{
        position: "fixed",
        top: 0,
        right: open ? 0 : "-420px",
        width: "420px",
        maxWidth: "90vw",
        height: "100vh",
        background: "#fff",
        boxShadow: "-4px 0 18px rgba(0,0,0,.25)",
        zIndex: 1200,
        display: "flex",
        flexDirection: "column",
        transition: "right .25s ease",
      }}
    >
      <div
        className="cart-header d-flex justify-content-between align-items-center px-3 py-2"
        style={{ background: "#2c2c2c", color: "#fff" }}
      >
        <h3 className="m-0">Your Cart</h3>
        <button
          id="close-cart"
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            color: "#fff",
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      <div
        id="cart-items"
        className="cart-items px-3 py-2"
        style={{ overflowY: "auto", flex: 1 }}
      >
        {cart.length === 0 ? (
          <p className="empty text-muted">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div
              key={String(item.menuItem)}
              className="cart-item d-grid align-items-center"
              style={{
                gridTemplateColumns: "1fr auto auto auto",
                gap: "10px",
                padding: "10px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <div className="ci-name fw-semibold">{item.name}</div>

              <div className="ci-controls d-inline-flex align-items-center gap-2">
                <button
                  className="qty-btn"
                  onClick={() => onChangeQty(item.menuItem, -1)}
                >
                  −
                </button>
                <span className="qty">{item.qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => onChangeQty(item.menuItem, +1)}
                >
                  +
                </button>
              </div>

              <div className="ci-price fw-bold">
                ${(item.price * item.qty).toFixed(2)}
              </div>

              <button
                className="remove-btn"
                onClick={() => onRemove(item.menuItem)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                🗑
              </button>
            </div>
          ))
        )}
      </div>

      <div className="cart-footer px-3 py-3 border-top">
        <div id="cart-total" className="cart-total-row">
          <div>Subtotal: ${subtotal.toFixed(2)}</div>
          <div>Tax (8.875%): ${tax.toFixed(2)}</div>
          <strong>Total: ${total.toFixed(2)}</strong>
        </div>

        <div className="cart-actions d-flex gap-2">
          <button
            id="clear-cart"
            className="btn-secondary flex-grow-1"
            onClick={onClear}
          >
            Clear Cart
          </button>

          <button
            className="btn btn-warning flex-grow-1"
            onClick={onCheckout}
            disabled={cart.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </aside>
  );
}

// MAIN APP
export default function App() {
  const [cartOpen, setCartOpen] = useState(false);

  // menu from backend
  const [menu, setMenu] = useState([]);

  // cart persisted in MongoDB
  const [cartId, setCartId] = useState(null);
  const [cart, setCart] = useState([]);

  // Fetch menu from Render backend
  useEffect(() => {
    fetch(`https://lastbite-backend.onrender.com/api/menu`)
      .then((r) => r.json())
      .then(setMenu)
      .catch(console.error);
  }, []);

  // Create/load cart from backend, store cart id in localStorage
  useEffect(() => {
    (async () => {
      try {
        let id = localStorage.getItem("lastbite_cart_id");

        if (!id) {
          const created = await fetch(`https://lastbite-backend.onrender.com/api/carts`, {
            method: "POST",
          }).then((r) => r.json());

          id = created._id;
          localStorage.setItem("lastbite_cart_id", id);
        }

        setCartId(id);

        const c = await fetch(`https://lastbite-backend.onrender.com/api/carts/${id}`).then((r) => r.json());
        setCart(c.items || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const appetizers = menu.filter((i) => i.category === "appetizer");
  const entrees = menu.filter((i) => i.category === "entree");
  const desserts = menu.filter((i) => i.category === "dessert");

  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);

  async function addToCart(menuItemId) {
    if (!cartId) return;

    const updated = await fetch(`https://lastbite-backend.onrender.com/api/carts/${cartId}/items`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItemId, qtyDelta: 1 }),
    }).then((r) => r.json());

    setCart(updated.items || []);
  }

  async function changeQty(menuItemId, delta) {
    if (!cartId) return;

    const updated = await fetch(`https://lastbite-backend.onrender.com/api/carts/${cartId}/items`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItemId, qtyDelta: delta }),
    }).then((r) => r.json());

    setCart(updated.items || []);
  }

  async function removeItem(menuItemId) {
    if (!cartId) return;

    const updated = await fetch(
      `https://lastbite-backend.onrender.com/api/carts/${cartId}/items/${menuItemId}`,
      { method: "DELETE" }
    ).then((r) => r.json());

    setCart(updated.items || []);
  }

  async function clearCart() {
    if (!cartId) return;

    const updated = await fetch(`https://lastbite-backend.onrender.com/api/carts/${cartId}`, {
      method: "DELETE",
    }).then((r) => r.json());

    setCart(updated.items || []);
  }

  async function checkout() {
    if (!cartId) return;

    const res = await fetch(`https://lastbite-backend.onrender.com/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.message || "Checkout failed");
      return;
    }

    const order = await res.json();
    alert(`Order placed! Total: $${Number(order.total).toFixed(2)}`);

    // after checkout, clear cart UI by clearing the cart in DB
    await clearCart();
  }

  return (
    <div style={{ backgroundColor: "#f5f0e6", minHeight: "100vh" }}>
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <Hero />

      <main id="menu" className="menu text-center py-5">
        <MenuTable title="Appetizers" items={appetizers} onAdd={addToCart} />
        <MenuTable title="Entrees" items={entrees} onAdd={addToCart} />
        <MenuTable title="Desserts" items={desserts} onAdd={addToCart} />
        <Slider />
      </main>

      <About />
      <Contact />
      <Footer />

      <CartPanel
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onClear={clearCart}
        onChangeQty={changeQty}
        onRemove={removeItem}
        onCheckout={checkout}
      />
    </div>
  );
}
