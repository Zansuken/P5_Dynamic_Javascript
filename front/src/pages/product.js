import { updateCartIcon } from "../components/CartState.js";
import {
  addToCartBtnNode,
  colorInputContainerNode,
  colorsInputNode,
  currentCartStateDetailsNode,
  descriptionNode,
  imgContainerNode,
  priceNode,
  quantityInputContainerNode,
  quantityInputNode,
  titleNode,
  URL,
} from "../constants.js";
import { Image, SnackBar, Option } from "../customComponents.js";
import { animateErrorMessage } from "../helpers/animations.js";
import {
  errorMessageGenerator,
  removeErrorMessage,
} from "../helpers/builders.js";
import {
  getSingleProductData,
  addToLocalStorage,
} from "../helpers/requests.js";

if (URL.includes("product")) {
  const queryString = window.location.search;

  const params = new URLSearchParams(queryString);

  const productId = params.get("id");

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

    imgContainerNode().appendChild(Image({ src: imageUrl, alt: altTxt }));

    titleNode().innerText = name;
    priceNode().innerText = productPrice;
    descriptionNode().innerText = productDescription;

    colors.forEach((color) => {
      colorsInputNode().append(Option({ value: color, isCapitalized: true }));
    });

    colorsInputNode().addEventListener("change", (event) => {
      dataToSave = { ...dataToSave, color: "" };
      if (!event.target.value || event.target.selectedOptions.index === 0) {
        errorMessageGenerator({
          node: colorInputContainerNode(),
          id: "colorError",
          type: "error",
          value: "La sélection d'une couleur est obligatoire",
        });
      }
      if (event.target.value) {
        removeErrorMessage("colorError");
        dataToSave = { ...dataToSave, color: event.target.value };
      }
    });

    quantityInputNode().addEventListener("change", (event) => {
      dataToSave = { ...dataToSave, quantity: "" };
      if (!event.target.value || event.target.value < 1) {
        errorMessageGenerator({
          node: quantityInputContainerNode(),
          id: "quantityError",
          type: "error",
          value: "Le nombre de produit à ajouter est manquant ou incorrect",
        });
      }
      if (event.target.value && event.target.value >= 1) {
        removeErrorMessage("quantityError");
        dataToSave = {
          ...dataToSave,
          quantity: event.target.value,
        };
      }
    });

    addToCartBtnNode().addEventListener("click", () => {
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
      currentCartStateDetailsNode()?.remove();
      updateCartIcon();
    });
  } catch (error) {
    console.error(error);
  }
}
