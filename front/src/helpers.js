import {
  BASE_URL,
  displayedErrorNode,
  formNode,
  geoApiURL,
  globalTotalPriceNode,
  globalTotalQuantityNode,
  selectedNode,
} from "./constants.js";
import { Paragraph } from "./customComponents.js";

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

// Generates random id
export const orderIdGenerator = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
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

// Concatenate children nodes (for custom components)
export const addChildren = (node, children) => {
  Object.keys(children).forEach((key) => {
    node.append(children[key]);
  });
};

// Show a loading spinner
export const startLoading = (node, isLoading) => {
  const loader = document.createElement("div");

  loader.setAttribute("id", "loader");

  loader.classList.add("loadingSpinner");

  const loaderAnimation = [
    {
      transform: "rotate(0deg)",
    },
    {
      transform: "rotate(360deg)",
    },
  ];

  const loaderTiming = {
    duration: 2000,
    iterations: Infinity,
  };

  loader.animate(loaderAnimation, loaderTiming);

  if (node && isLoading) {
    node.append(loader);
  }

  if (!isLoading) {
    node.remove(loader);
  }
};

// Remove the loading spinner
export const finishLoading = () => document.querySelector("#loader").remove();

// Capitalize strings
export const capitalize = (string) => {
  const lowerCase = string.toLowerCase();
  return string.charAt(0).toUpperCase() + lowerCase.slice(1);
};

// Build the error message form
export const buildErrorMessage = (label, value, message) => {
  const errorRecipient = getRelatedInput(label);
  errorRecipient.innerText = `${value} ${message}!`;
};

// Remove the error message form
export const removeFormErrorMessage = (label) => {
  const errorRecipient = getRelatedInput(label);
  if (errorRecipient) {
    errorRecipient.innerText = "";
  }
  return;
};

// Get ErrorMessage input form
export const getRelatedInput = (label) =>
  document.querySelector(`#${label}ErrorMsg`);

// Check if given string includes numbers
export const hasNumber = (string) => /\d/.test(string);

export const checkStreet = async (address, value) => {
  const response = await isAddressValid(address, value);
  return response;
};

// Check if given address exists and send its status (with an API => https://www.geoapify.com/)
export const isAddressValid = async (address, city) => {
  // Build the request url with the given address input
  const url = geoApiURL(address);

  // Return all corresponding data
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.features.length === 0) {
      return "unknownAddress";
    } else {
      const foundCity =
        data.features[0].properties.city || data.features[0].properties.state;
      const foundNumber = data.features[0].properties.housenumber;
      const foundStreet = data.features[0].properties.street;

      // Check if given city and found city is equivalent
      if (foundCity?.toLowerCase() !== city.toLowerCase()) {
        return "cityAndStreetNoMatch";
      } else {
        const addressNode = formNode().elements["address"];

        addressNode.value = `${foundNumber} ${foundStreet}`;
        return "";
      }
    }
  } catch (error) {
    console.error(error.message);
  }
};

// Check if given string is an valid city
export const isValidCity = (string) =>
  /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/.test(string);

// Check if given string is an email
export const isValidEmail = (string) =>
  /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(string);

// Generate error message
export const errorMessageGenerator = (props = { node, id, type, value }) => {
  const { node, id, type, value } = props;

  const errorElement = Paragraph({
    id,
    type,
    value,
  });

  node.after(errorElement);
};

// Remove error message
export const removeErrorMessage = (id) => {
  if (displayedErrorNode(id)) {
    displayedErrorNode(id).remove();
  }
};

// Animate error message
export const animateErrorMessage = (id) => {
  if (selectedNode(id)) {
    const animation = [
      {
        transform: "translateX(0px)",
      },
      {
        transform: "translateX(5px)",
      },
      {
        transform: "translateX(-5px)",
      },
      {
        transform: "translateX(4px)",
      },
      {
        transform: "translateX(-4px)",
      },
      {
        transform: "translateX(2px)",
      },
      {
        transform: "translateX(-2px)",
      },
      {
        transform: "translateX(0px)",
      },
    ];

    const timing = {
      duration: 500,
      iteration: 1,
    };

    selectedNode(id).animate(animation, timing);
  }
};

// Animate snackbar
export const animateSnackbar = (id) => {
  const animation = [];
  // Generate animation
  for (let index = 0; index < 10; index++) {
    if (index === 0 || index === 9) {
      animation.push({
        bottom: "-30px",
        opacity: 0,
      });
    } else {
      animation.push({
        bottom: "15px",
        opacity: 1,
      });
    }
  }

  const timing = {
    duration: 5000,
    iteration: 1,
  };

  // Add animation to targeted element
  selectedNode(id).animate(animation, timing);
  setTimeout(function () {
    if (selectedNode(id)) {
      selectedNode(id).remove();
    }
  }, 5000);
};

// Format number to €
export const formatToEuro = (number) =>
  Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(number);

// Change the display of CartState depending its previous state
export const cartStateSwitch = ({
  elementToHide,
  elementToShow,
  elementGenerator,
  cart,
  products,
  isDefaultState,
}) => {
  // If element is displayed we add a listener on click
  elementToHide?.addEventListener("click", () => {
    // Add a class that changes the display prop to "none"
    elementToHide?.classList.add("hide");
    // Depending on which state we show only the icon or the cart details
    if (isDefaultState) {
      elementGenerator(cart, products);
    } else {
      elementGenerator(cart.length, cart, products);
    }
    // Add a class that changes the display prop to "flex" on top of "hide" className
    elementToShow?.classList.add("show");
  });
};

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
