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

// Post order
export const sendOrder = async (contact, cartSummary) => {
  const cart = getLocalStorage("cart");
  const products = cart.map((product) => product.id);
  const order = { contact, products, cartSummary };
  const response = await fetch(`${BASE_URL}/order`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  getOrderId(response);
};

// Get order id from POST and add it to local storage
export const getOrderId = async (data) => {
  const order = await data.json();
  addOrderIdToLocalStorage("orderId", order?.orderId);
  redirectToConfirmationPage(order?.orderId);
};

//generates random id;
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
  window.location.replace(`confirmation.html?id=${orderId}`);

// Redirect to home page
export const redirectToHomePage = () => (window.location.href = "./index.html");

// Local storage

// Get local storage
export const getLocalStorage = (key) => {
  const storage = window.localStorage.getItem(key);
  return JSON.parse(storage);
};

// Add a single item to local storage
export const addToLocalStorage = (key, value) => {
  if (!getLocalStorage(key)) {
    const productList = [];
    productList.push(value);
    const convertedValue = JSON.stringify(productList);
    window.localStorage.setItem(key, convertedValue);
  } else {
    const currentState = getLocalStorage(key);
    const productList = [...currentState];

    const { id, color, quantity } = value;

    const productToUpdate = productList.filter(
      (product) => product.id === id && product.color === color
    );

    let currentProduct = {
      id,
      color,
      quantity,
    };

    if (productToUpdate[0]) {
      productList.map((product, index) => {
        if (
          product.id === productToUpdate[0].id &&
          product.color === productToUpdate[0].color
        ) {
          currentProduct = {
            ...productToUpdate[0],
            quantity: (
              Number(productToUpdate[0].quantity) + Number(value.quantity)
            ).toString(),
          };
          productList.splice(index, 1, currentProduct);
        }
      });
    } else {
      productList.push(value);
    }
    const convertedValue = JSON.stringify(productList);
    window.localStorage.setItem(key, convertedValue);
  }
  updateCartSummary(key);
};

// Remove a single item to local storage
export const removeFromLocalStorage = (key, elementToRemove) => {
  if (getLocalStorage(key)) {
    const productList = getLocalStorage(key);

    const { id, color } = elementToRemove;

    const productToRemove = productList.filter(
      (product) => product.id === id && product.color === color
    );

    if (productToRemove[0]) {
      productList.map((product, index) => {
        if (
          product.id === productToRemove[0].id &&
          product.color === productToRemove[0].color
        ) {
          productList.splice(index, 1);
        }
      });
      window.localStorage.setItem(key, JSON.stringify(productList));
    }
    updateCartSummary(key);
  }
};

// Change number of item
export const updateSingleItem = (key, elementToUpdate) => {
  if (getLocalStorage(key)) {
    const productList = getLocalStorage(key);

    const { id, color, quantity, price } = elementToUpdate;

    const productToUpdate = productList.filter(
      (product) => product.id === id && product.color === color
    );

    if (productToUpdate[0]) {
      productList.map((product, index) => {
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

// Update Cart Summary
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

// Add orderId to local storage
export const addOrderIdToLocalStorage = (key, orderId) => {
  window.localStorage.setItem(key, JSON.stringify(orderId));
};

// Remove orderId to local storage
export const removeOrderIdToLocalStorage = (key) => {
  if (getLocalStorage(key)) {
    window.localStorage.removeItem(key);
  }
};

// Clear local storage
export const clearLocalStorage = () => window.localStorage.clear();

// Concatenate children nodes
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

// Capitalize words
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

// Check if given address exists
export const isAddressValid = (address, city, addressLabel, value) => {
  const url = geoApiURL(address);
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      if (result.features.length === 0) {
        buildErrorMessage(addressLabel, value, "est incorrecte");
      } else {
        const foundCity = result.features[0].properties.city;
        const foundNumber = result.features[0].properties.housenumber;
        const foundStreet = result.features[0].properties.street;

        if (foundCity.toLowerCase() !== city.toLowerCase()) {
          buildErrorMessage(
            addressLabel,
            value,
            "n'existe pas dans la ville associée"
          );
        } else {
          const addressNode = formNode().elements["address"];
          removeFormErrorMessage(addressLabel);
          addressNode.value = `${foundNumber} ${foundStreet}`;
        }
      }
    })
    .catch((error) => console.error("error", error.message));
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
  const animation = [
    {
      bottom: "-30px",
      opacity: 0,
    },
    {
      bottom: "15px",
      opacity: 1,
    },
    {
      bottom: "15px",
      opacity: 1,
    },
    {
      bottom: "15px",
      opacity: 1,
    },
    {
      bottom: "15px",
      opacity: 1,
    },
    {
      bottom: "15px",
      opacity: 1,
    },
    {
      bottom: "15px",
      opacity: 1,
    },
    {
      bottom: "15px",
      opacity: 1,
    },
    {
      bottom: "15px",
      opacity: 1,
    },
    {
      bottom: "-30px",
      opacity: 0,
    },
  ];

  const timing = {
    duration: 5000,
    iteration: 1,
  };

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

export const cartStateSwitch = ({
  elementToHide,
  elementToShow,
  elementGenerator,
  cart,
  products,
  isDefaultState,
}) => {
  elementToHide?.addEventListener("click", () => {
    elementToHide?.classList.add("hide");
    if (isDefaultState) {
      elementGenerator(cart, products);
    } else {
      elementGenerator(cart.length, cart, products);
    }
    elementToShow?.classList.add("show");
  });
};

// Update totalPrice and totalQuantity displayed values
export const updateTotalPriceQuantityDisplayed = () => {
  const updatedCart = getLocalStorage("cart");

  let newTotalQuantity = 0;
  let newTotalPrice = 0;

  updatedCart?.forEach((item) => {
    newTotalQuantity = Number(newTotalQuantity) + Number(item.quantity);
    newTotalPrice = Number(newTotalPrice) + Number(item.totalPrice);
  });

  globalTotalQuantityNode().innerText = newTotalQuantity;
  globalTotalPriceNode().innerText = formatToEuro(newTotalPrice);
};
