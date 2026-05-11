// ================= GET CART =================
export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// ================= SAVE CART =================
export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("storage"));
};

// ================= ADD TO CART =================
export const addToCart = (product) => {
  const cart = getCart();

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
};

// ================= REMOVE ITEM =================
export const removeFromCart = (productId) => {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
};

// ================= UPDATE QUANTITY =================
export const updateQuantity = (productId, quantity) => {
  const cart = getCart().map((item) =>
    item.id === productId ? { ...item, quantity } : item
  );

  saveCart(cart);
};

// ================= TOTAL COUNT =================
export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

// ================= TOTAL PRICE =================
export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

// ================= CLEAR CART =================
export const clearCart = () => {
  localStorage.removeItem("cart");
  window.dispatchEvent(new Event("storage"));
};