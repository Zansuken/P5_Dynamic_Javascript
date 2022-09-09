import { addChildren, capitalize } from "./helpers.js";
// HTML Elements

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
export const Article = (children) => {
  let errorMessage = "";

  if (!children) {
    errorMessage = "article cannot be self closing";
  }
  if (errorMessage) {
    console.error(`Error: ${errorMessage}`);
    return;
  }
  const article = document.createElement("article");
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
export const Paragraph = (props = { value }) => {
  const { value } = props;

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

  return p;
};
export const Div = document.createElement("div");
export const htmlInput = document.createElement("input");

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
