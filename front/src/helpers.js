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

  loader.style.border = "16px solid #f3f3f3";
  loader.style.borderTop = "16px solid #3498db";
  loader.style.borderRadius = "50%";
  loader.style.width = "120px";
  loader.style.height = "120px";

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
