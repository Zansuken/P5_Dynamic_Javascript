// URL
export const URL = window.location.href;
export const GEO_API_KEY = "e7c259ac59784583adec1b45181b2fa8";
export const geoApiURL = (ADDRESS_TO_SEARCH) =>
  `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    ADDRESS_TO_SEARCH
  )}&apiKey=${GEO_API_KEY}`;

// HTML Elements

// Nodes selectors

export const pageNode = () => document.querySelector("body");
export const currentCartStateIconNode = () =>
  document.querySelector("#cartState");
export const currentCartStateDetailsNode = () =>
  document.querySelector("#cartStateDetails");
export const singleTotalPriceNode = (itemId, itemColor) =>
  document.getElementById(`${itemId}-${itemColor}`);

export const globalTotalPriceNode = () => document.querySelector("#totalPrice");
export const globalTotalQuantityNode = () =>
  document.querySelector("#totalQuantity");
export const cartContainerNode = () => document.querySelector("#cart__items");
export const imgContainerNode = () => document.querySelector(".item__img");
export const titleNode = () => document.querySelector("#title");
export const priceNode = () => document.querySelector("#price");
export const descriptionNode = () => document.querySelector("#description");
export const colorInputContainerNode = () =>
  document.querySelector(".item__content__settings__color");
export const colorsInputNode = () => document.querySelector("#colors");
export const quantityInputContainerNode = () =>
  document.querySelector(".item__content__settings__quantity");
export const quantityInputNode = () => document.querySelector("#quantity");
export const addToCartBtnNode = () => document.querySelector("#addToCart");
export const productsContainerNode = () => document.querySelector("#items");
export const displayedErrorNode = (id) => document.querySelector(`#${id}`);
export const selectedNode = (id) => document.getElementById(id);
export const formNode = () =>
  document.querySelector(".cart__order .cart__order__form");
export const orderIdNode = () => document.getElementById("orderId");
