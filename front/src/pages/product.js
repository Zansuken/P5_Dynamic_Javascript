import { Image, Option } from "../constants.js";
import { getSingleProductData } from "../helpers.js";

const url = window.location.href;

if (url.includes("product")) {
  const queryString = window.location.search;

  const params = new URLSearchParams(queryString);

  const productId = params.get("id");

  const imgContainer = document.querySelector(".item__img");
  const title = document.querySelector("#title");
  const price = document.querySelector("#price");
  const description = document.querySelector("#description");
  const colorsInput = document.querySelector("#colors");

  try {
    const product = await getSingleProductData(productId);
    console.log("product: ", product);
    const {
      imageUrl,
      altTxt,
      name,
      price: productPrice,
      description: productDescription,
      colors,
    } = product;

    imgContainer.appendChild(Image({ src: imageUrl, alt: altTxt }));

    title.innerText = name;
    price.innerText = productPrice;
    description.innerText = productDescription;

    colors.forEach((color) => {
      colorsInput.append(Option({ value: color, isCapitalized: true }));
    });
  } catch (error) {
    console.error(error);
  }
}
