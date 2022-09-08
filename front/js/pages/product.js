import { Image } from "../constants.js";
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
  const colors = document.querySelector("#colors");

  try {
    const product = await getSingleProductData(productId);
    console.log(product);
    const {
      imageUrl,
      altTxt,
      name,
      price: productPrice,
      description: productDescription,
    } = product;

    imgContainer.appendChild(Image({ src: imageUrl, alt: altTxt }));

    title.innerText = name;
    price.innerText = productPrice;
    description.innerText = productDescription;
  } catch (error) {
    console.error(error.message);
  }
}
