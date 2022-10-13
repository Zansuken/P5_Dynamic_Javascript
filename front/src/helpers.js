import {
  displayedErrorNode,
  globalTotalPriceNode,
  globalTotalQuantityNode,
  selectedNode,
} from "./constants.js";
import { Paragraph } from "./customComponents.js";

// Fetch products
export const getProductsData = async () => {
  const response = await fetch("http://localhost:3000/api/products");
  const products = await response.json();

  return products;
};

// Fetch one product
export const getSingleProductData = async (id) => {
  const response = await fetch(`http://localhost:3000/api/products/${id}`);
  const product = await response.json();

  return product;
};

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

export const getCartSummary = () => {
  if (!getLocalStorage("cartSummary")) return;
  const result = window.localStorage.getItem("cartSummary");
  return JSON.parse(result);
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
