import {
  confirmationContainerNode,
  currentCartStateDetailsNode,
  currentCartStateIconNode,
  pageNode,
} from "./constants.js";
import {
  addChildren,
  animateSnackbar,
  capitalize,
  formatToEuro,
  getCartSummary,
  getLocalStorage,
} from "./helpers.js";

// Generate an anchor element
export const Link = (props = { href }, children) => {
  const { href } = props;

  let errorMessage = "";
  if (!href) {
    errorMessage = "href is missing";
  }
  if (href) {
    if (typeof href !== "string") {
      errorMessage = "href is must be a string";
    }

    const link = document.createElement("a");

    link.setAttribute("href", href);

    if (children) {
      addChildren(link, children);
    }

    return link;
  }
  if (errorMessage) {
    console.error(`Error: ${errorMessage}`);
    return;
  }
};

// Generate an article element
export const Article = (props = { classes }, children) => {
  const { classes } = props;

  let errorMessage = "";

  if (!children) {
    errorMessage = "article cannot be self closing";
  }
  if (errorMessage) {
    console.error(`Error: ${errorMessage}`);
    return;
  }
  const article = document.createElement("article");

  if (classes) {
    article.classList.add(classes);
  }

  addChildren(article, children);
  return article;
};

// Generate an image element
export const Image = (props = { src, alt }) => {
  const { src, alt } = props;

  let errorMessage = "";

  if (!src) {
    errorMessage = "src is missing";
  }
  if (src && typeof src !== "string") {
    errorMessage = "src must be a string";
  }
  if (!alt) {
    console.warn("Warning: alt is missing");
  }
  if (alt && typeof alt !== "string") {
    errorMessage = "src must be a string";
  }
  if (errorMessage) {
    console.error(`Error: ${errorMessage}`);
    return;
  }
  const image = document.createElement("img");
  image.setAttribute("src", src);
  if (alt) {
    image.setAttribute("alt", alt);
  }
  return image;
};

// Generate a title element
export const Title = (props = { type, value }) => {
  const { type, value } = props;

  let errorMessage = "";

  if (typeof type !== "number") {
    errorMessage = "type must be a number";
  }

  if (type < 1 || type > 6) {
    errorMessage = "type must be equal or between 1 and 6";
  }
  if (errorMessage) {
    console.error(`Error: ${errorMessage}`);
    return;
  }

  const title = document.createElement(`h${type}`);
  title.innerText = value;
  return title;
};

// Generate a paragraph element
export const Paragraph = (props = { id, type, value, classes }) => {
  const { id, type, value, classes } = props;

  let errorMessage = "";

  if (!value) {
    errorMessage = "p is empty";
  }

  if (errorMessage) {
    console.error(`Error: ${errorMessage}`);
    return;
  }

  const p = document.createElement("p");

  p.innerText = value;

  if (id) {
    p.setAttribute("id", id);
  }

  if (type === "error") {
    p.classList.add("errorStyle");
  }

  if (classes) {
    p.classList.add(classes);
  }

  return p;
};

// Generate a div
export const Div = (props = { classes }, children) => {
  const { classes } = props;

  let errorMessage = "";

  if (!children) {
    errorMessage = "a div cannot be self closing";
  }
  if (errorMessage) {
    console.error(`Error: ${errorMessage}`);
    return;
  }
  const div = document.createElement("div");
  if (!classes) {
    div.classList.add("divStyle");
  }
  if (classes) {
    div.classList.add(classes);
  }
  addChildren(div, children);
  return div;
};

// Generate an input
export const Input = (
  props = { type, name, min, max, value, isCapitalized, classes }
) => {
  const { type, name, min, max, value, isCapitalized, classes } = props;

  let errorMessage = "";

  if (!type || typeof type !== "string") {
    errorMessage = "input type is missing or is not a string";
  }

  if (!name || typeof name !== "string") {
    errorMessage = "input name is missing or is not a string";
  }

  if (errorMessage) {
    console.error(`Error: ${errorMessage}`);
    return;
  }

  const input = document.createElement("input");

  input.setAttribute("type", type);
  input.setAttribute("name", name);

  if (min) {
    input.setAttribute("min", min);
  }
  if (max) {
    input.setAttribute("max", max);
  }

  if (isCapitalized && type !== "number") {
    input.innerText = capitalize(value);
    return input;
  }

  if (classes) {
    input.classList.add(classes);
  }

  if (type === "number" && value) {
    input.setAttribute("value", value);
  } else {
    input.innerText = value;
  }

  return input;
};

// Generate option for select input
export const Option = (props = { value, isCapitalized }) => {
  const { value, isCapitalized } = props;

  let errorMessage = "";

  if (!value) {
    errorMessage = "value is missing";
  }

  if (errorMessage) {
    console.error(`Error: ${errorMessage}`);
    return;
  }

  const option = document.createElement("option");

  option.setAttribute("value", value);

  if (isCapitalized) {
    option.innerText = capitalize(value);
    return option;
  }

  option.innerText = value;
  return option;
};

// Generate an information snackbar
export const SnackBar = (message, type) => {
  const displayedMessage = Paragraph({ value: message });

  const snackbar = Div({ classes: "snackbar" }, { displayedMessage });

  snackbar.setAttribute("id", "snackbar");

  if (type === "success") {
    snackbar.classList.add("snackbarSuccess");
  }

  pageNode().append(snackbar);
  animateSnackbar("snackbar");
};

export const CartStateIcon = (quantity) => {
  currentCartStateIconNode()?.remove();
  const displayedQuantity = Paragraph({ value: quantity });
  const bagIcon = Image({ src: "../images/icons/bag.svg", alt: "bag icon" });

  const container = Div(
    { classes: "cartState" },
    { displayedQuantity, bagIcon }
  );

  container.setAttribute("id", "cartState");

  pageNode().append(container);
};

export const CartStateDetails = (cart, products) => {
  currentCartStateDetailsNode()?.remove();

  const list = document.createElement("ul");
  const lastLine = document.createElement("li");
  const closeButton = document.createElement("button");

  closeButton.setAttribute("id", "closeDetailsButton");
  closeButton.classList.add("closeDetailsButton");

  closeButton.textContent = "X";

  cart.forEach((element) => {
    const { id, color, quantity } = element;

    const associatedElement = products.filter(
      (product) => product._id === id
    )[0];

    const { name, price } = associatedElement;

    const lineContent = `x${quantity} ${name} (${color}): ${formatToEuro(
      price * quantity
    )}`;

    const line = document.createElement("li");
    line.textContent = lineContent;

    list.append(line);
  });

  const { totalQuantity, totalPrice } = getCartSummary();

  const lineTotal = `${totalQuantity} articles pour ${formatToEuro(
    totalPrice
  )}`;

  lastLine.textContent = lineTotal;

  list.append(lastLine);

  const container = Div({ classes: "cartStateDetails" }, { list, closeButton });

  container.setAttribute("id", "cartStateDetails");

  pageNode().append(container);
  container.classList.add("show");
  closeButton.addEventListener("click", () => {
    container.classList.remove("show");
    currentCartStateIconNode()?.classList.remove("hide");
    currentCartStateIconNode()?.classList.add("show");
  });
};

export const OrderDetails = (products) => {
  const cart = getLocalStorage("cart");

  const listContainer = confirmationContainerNode().childNodes[1];
  const list = document.createElement("ul");
  const firstLine = document.createElement("li");
  const lastLine = document.createElement("li");
  const btnContainer = document.createElement("div");
  const backToHomeBtn = document.createElement("button");

  btnContainer.classList.add("confirmation__action");
  backToHomeBtn.textContent = "Page d'accueil";
  backToHomeBtn.setAttribute("id", "backToHomeBtn");
  btnContainer.appendChild(backToHomeBtn);

  firstLine.textContent = "Résumé :";

  list.append(firstLine);

  cart.forEach((element) => {
    const { id, color, quantity } = element;

    const associatedElement = products.filter(
      (product) => product._id === id
    )[0];

    const { name, price } = associatedElement;

    const lineContent = `x${quantity} ${name} (${color}): ${formatToEuro(
      price * quantity
    )}`;

    const line = document.createElement("li");
    line.textContent = lineContent;

    list.append(line);
  });

  const { totalQuantity, totalPrice } = getCartSummary();

  const lineTotal = `${totalQuantity} articles pour ${formatToEuro(
    totalPrice
  )}`;

  lastLine.textContent = lineTotal;

  list.append(lastLine);

  listContainer.appendChild(list);
  listContainer.appendChild(btnContainer);
};
