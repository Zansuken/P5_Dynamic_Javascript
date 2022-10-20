import {
  BASE_URL,
  globalTotalPriceNode,
  globalTotalQuantityNode,
} from "../constants.js";

// -- Requests -- //

// Fetch products
export const getProductsData = async () => {
  const response = await fetch(BASE_URL);
  const products = await response.json();

  return products;
};

// Fetch one product
export const getSingleProductData = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  const product = await response.json();

  return product;
};

// POST order
export const sendOrder = async (contact, cartSummary) => {
  const cart = getLocalStorage("cart");

  // Build the products list
  const products = cart.map((product) => product.id);

  // Build the order object
  const order = { contact, products, cartSummary };
  // Send the POST request
  const response = await fetch(`${BASE_URL}/order`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  // Get the orderId received from the POST request => redirect to confirmation page
  const responseOrder = await response.json();
  redirectToConfirmationPage(responseOrder?.orderId);
};

// Redirect to confirmation page
export const redirectToConfirmationPage = (orderId) =>
  (window.location.href = `./confirmation.html?id=${orderId}`);

// Redirect to home page
export const redirectToHomePage = () => (window.location.href = "./index.html");

// -- Local storage -- //

// Get local storage
export const getLocalStorage = (key) => {
  const storage = window.localStorage.getItem(key);
  return JSON.parse(storage);
};

// Add a single item to local storage
export const addToLocalStorage = (key, value) => {
  // No key => create/fill
  if (!getLocalStorage(key)) {
    const productList = [];
    productList.push(value);
    const convertedValue = JSON.stringify(productList);
    window.localStorage.setItem(key, convertedValue);
  } else {
    // Existing key => update the key

    // Get current key state
    const currentState = getLocalStorage(key);
    const productList = [...currentState];

    const { id, color, quantity } = value;

    // Search for the right product to update
    const productToUpdate = productList.filter(
      (product) => product.id === id && product.color === color
    );

    // Mock the object to send
    let currentProduct = {
      id,
      color,
      quantity,
    };

    // If the product exists => update
    if (productToUpdate[0]) {
      productList.forEach((product, index) => {
        // Loop through the products list from API
        if (
          product.id === productToUpdate[0].id &&
          product.color === productToUpdate[0].color
        ) {
          // If match => update mocked object to send with previous state
          currentProduct = {
            ...productToUpdate[0],
            quantity: (
              Number(productToUpdate[0].quantity) + Number(value.quantity)
            ).toString(),
          };
          // Replace related product with the updated one
          productList.splice(index, 1, currentProduct);
        }
      });
    } else {
      // No product found => add directly to related key
      productList.push(value);
    }
    // Convert to JSON format then store it
    const convertedValue = JSON.stringify(productList);
    window.localStorage.setItem(key, convertedValue);
  }
  // Trigger the cartSummary update in local storage
  updateCartSummary(key);
};

// Remove a single item to local storage
export const removeFromLocalStorage = (key, elementToRemove) => {
  // Trigger only if the key exists
  if (getLocalStorage(key)) {
    const productList = getLocalStorage(key);

    const { id, color } = elementToRemove;

    // Search targeted product
    const productToRemove = productList.filter(
      (product) => product.id === id && product.color === color
    );

    // If the product exists => remove
    if (productToRemove[0]) {
      productList.forEach((product, index) => {
        if (
          product.id === productToRemove[0].id &&
          product.color === productToRemove[0].color
        ) {
          // If match => remove
          productList.splice(index, 1);
        }
      });
      // Convert to JSON format then update key
      window.localStorage.setItem(key, JSON.stringify(productList));
    }
    // Trigger the cartSummary update in local storage
    updateCartSummary(key);
  }
};

// Change number of item (same as previous functions but for quantities)
export const updateSingleItem = (key, elementToUpdate) => {
  if (getLocalStorage(key)) {
    const productList = getLocalStorage(key);

    const { id, color, quantity, price } = elementToUpdate;

    const productToUpdate = productList.filter(
      (product) => product.id === id && product.color === color
    );

    if (productToUpdate[0]) {
      productList.forEach((product, index) => {
        if (
          product.id === productToUpdate[0].id &&
          product.color === productToUpdate[0].color
        ) {
          const updatedProduct = {
            ...productToUpdate[0],
            quantity,
            totalPrice: quantity * price,
          };
          productList.splice(index, 1, updatedProduct);
        }
      });
      window.localStorage.setItem(key, JSON.stringify(productList));
      updateCartSummary(key);
    }
  }
};

// Update Cart Summary (add/update a second key in local storage for cart summary)
export const updateCartSummary = (key) => {
  const currentState = getLocalStorage(key);
  let totalQuantity = 0;
  let totalPrice = 0;
  currentState.forEach((item) => {
    const { quantity, price } = item;
    totalQuantity = totalQuantity + Number(quantity);
    totalPrice = totalPrice + Number(price) * quantity;
  });
  window.localStorage.setItem(
    "cartSummary",
    JSON.stringify({ totalPrice, totalQuantity })
  );
};

// Get Cart Summary
export const getCartSummary = () => {
  if (!getLocalStorage("cartSummary")) return;
  const result = window.localStorage.getItem("cartSummary");
  return JSON.parse(result);
};

// Clear local storage
export const clearLocalStorage = () => window.localStorage.clear();

// Update totalPrice and totalQuantity displayed values
export const updateTotalPriceQuantityDisplayed = () => {
  const updatedCart = getLocalStorage("cart");

  let newTotalQuantity = 0;
  let newTotalPrice = 0;

  // Calculate totals
  updatedCart?.forEach((item) => {
    newTotalQuantity = Number(newTotalQuantity) + Number(item.quantity);
    newTotalPrice = Number(newTotalPrice) + Number(item.totalPrice);
  });

  globalTotalQuantityNode().innerText = newTotalQuantity;
  globalTotalPriceNode().innerText = formatToEuro(newTotalPrice);
};
