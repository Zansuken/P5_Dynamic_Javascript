// URL
export const URL = window.location.href;

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
