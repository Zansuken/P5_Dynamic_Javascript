import { Paragraph } from "./constants.js";

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
    console.log(convertedValue);
    window.localStorage.setItem(key, convertedValue);
  } else {
    const currentState = JSON.parse(getLocalStorage(key));
    const productList = [...currentState];
    productList.push(value);
    const convertedValue = JSON.stringify(productList);
    window.localStorage.setItem(key, convertedValue);
  }
};

// Remove a single item to local storage
export const removeFromLocalStorage = (key) =>
  window.localStorage.removeItem(key);

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
export const finishLoading = () => {
  document.querySelector("#loader").remove();
};

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
  const displayedError = document.querySelector(`#${id}`);
  if (displayedError) {
    displayedError.remove();
  }
};

// Animate error message
export const animateErrorMessage = (id) => {
  if (document.getElementById(id)) {
    const element = document.getElementById(id);

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

    element.animate(animation, timing);
  }
};
