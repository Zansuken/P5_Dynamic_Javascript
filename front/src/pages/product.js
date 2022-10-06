import { updateCartIcon } from "../components/CartState.js";
import { Image, Option, SnackBar, URL } from "../constants.js";
import {
  addToLocalStorage,
  animateErrorMessage,
  errorMessageGenerator,
  getSingleProductData,
  removeErrorMessage,
} from "../helpers.js";

if (URL.includes("product")) {
  const queryString = window.location.search;

  const params = new URLSearchParams(queryString);

  const productId = params.get("id");

  const imgContainer = document.querySelector(".item__img");
  const title = document.querySelector("#title");
  const price = document.querySelector("#price");
  const description = document.querySelector("#description");
  const colorInputContainer = document.querySelector(
    ".item__content__settings__color"
  );
  const colorsInput = document.querySelector("#colors");
  const quantityInputContainer = document.querySelector(
    ".item__content__settings__quantity"
  );
  const quantityInput = document.querySelector("#quantity");
  const addToCartBtn = document.querySelector("#addToCart");

  try {
    const product = await getSingleProductData(productId);
    updateCartIcon();

    const {
      imageUrl,
      altTxt,
      name,
      price: productPrice,
      description: productDescription,
      colors,
    } = product;

    let dataToSave = {
      id: productId,
      color: "",
      quantity: "",
      price: productPrice,
    };

    let isValid;

    imgContainer.appendChild(Image({ src: imageUrl, alt: altTxt }));

    title.innerText = name;
    price.innerText = productPrice;
    description.innerText = productDescription;

    colors.forEach((color) => {
      colorsInput.append(Option({ value: color, isCapitalized: true }));
    });

    colorsInput.addEventListener("change", (event) => {
      dataToSave = { ...dataToSave, color: "" };
      if (!event.target.value || event.target.selectedOptions.index === 0) {
        errorMessageGenerator({
          node: colorInputContainer,
          id: "colorError",
          type: "error",
          value: "La sélection d'une couleur est obligatoire",
        });
        isValid = false;
      }
      if (event.target.value) {
        removeErrorMessage("colorError");
        dataToSave = { ...dataToSave, color: event.target.value };
        isValid = dataToSave.quantity && true;
      }
    });

    quantityInput.addEventListener("change", (event) => {
      dataToSave = { ...dataToSave, quantity: "" };
      if (!event.target.value || event.target.value < 1) {
        errorMessageGenerator({
          node: quantityInputContainer,
          id: "quantityError",
          type: "error",
          value: "Le nombre de produit à ajouter est manquant ou incorrect",
        });
        isValid = false;
      }
      if (event.target.value && event.target.value >= 1) {
        removeErrorMessage("quantityError");
        dataToSave = {
          ...dataToSave,
          quantity: event.target.value,
        };
        isValid = dataToSave.color && true;
      }
    });

    addToCartBtn.addEventListener("click", () => {
      if (!dataToSave.color || !dataToSave.quantity) {
        if (dataToSave.quantity) {
          animateErrorMessage("colorError");
        }
        if (dataToSave.color) {
          animateErrorMessage("quantityError");
        }
        if (!dataToSave.quantity && !dataToSave.color) {
          animateErrorMessage("colorError");
          animateErrorMessage("quantityError");
        }
        return;
      }
      SnackBar("Item added to your cart!", "success");
      const { price, quantity } = dataToSave;
      addToLocalStorage("cart", {
        ...dataToSave,
        totalPrice: price * quantity,
      });
      const resetCartDetails = document.querySelector("#cartStateDetails");
      resetCartDetails?.remove();
      updateCartIcon();
    });
  } catch (error) {
    console.error(error);
  }
}
