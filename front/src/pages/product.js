import { updateCartIcon } from "../components/CartState.js";
import {
  addToCartBtnNode,
  colorErrorNode,
  colorInputContainerNode,
  colorsInputNode,
  currentCartStateDetailsNode,
  descriptionNode,
  imgContainerNode,
  priceNode,
  quantityErrorNode,
  quantityInputContainerNode,
  quantityInputNode,
  titleNode,
  URL,
} from "../constants.js";
import {
  Image,
  SnackBar,
  Option,
} from "../components/customComponents/customComponents.js";
import { animateErrorMessage } from "../helpers/animations.js";
import {
  errorMessageGenerator,
  removeErrorMessage,
} from "../helpers/builders.js";
import {
  getSingleProductData,
  addToLocalStorage,
} from "../helpers/requests.js";

// Checks if we are on the product page.
if (URL.includes("product")) {
  // Gets the url parameters.
  const queryString = window.location.search;

  // Sets the parameter research.
  const params = new URLSearchParams(queryString);

  // Gets the productId value from its parameter.
  const productId = params.get("id");

  try {
    // Fetch the single product related from the API.
    const product = await getSingleProductData(productId);

    // Generates the top right CartIcon component if the cart exists.
    updateCartIcon();

    // Extracts the properties from the fetched product.
    const {
      imageUrl,
      altTxt,
      name,
      price: productPrice,
      description: productDescription,
      colors,
    } = product;

    // Initiate the object to save in the local storage.
    let dataToSave = {
      id: productId,
      color: "",
      quantity: 1,
    };

    // Selects and builds the image.
    imgContainerNode().appendChild(Image({ src: imageUrl, alt: altTxt }));

    // Selects and updates the name/price/description.
    titleNode().innerText = name;
    priceNode().innerText = productPrice;
    descriptionNode().innerText = productDescription;

    // Fill the color select input with the related product colors.
    colors.forEach((color) => {
      colorsInputNode().append(Option({ value: color, isCapitalized: true }));
    });

    // Adds a "change" listener to that select input.
    colorsInputNode().addEventListener("change", (event) => {
      // Updates the object to save with a color property.
      dataToSave = { ...dataToSave, color: "" };

      // Generates error message if no color is selected.
      if (!event.target.value || event.target.selectedOptions.index === 0) {
        errorMessageGenerator({
          node: colorInputContainerNode(),
          id: "colorError",
          type: "error",
          value: "La s??lection d'une couleur est obligatoire",
        });
      }

      // Removes the error message if a color is selected.
      if (event.target.value) {
        removeErrorMessage("colorError");

        // Updates the object to save with its previous state then the color selected.
        dataToSave = { ...dataToSave, color: event.target.value };
      }
    });

    // Adds a "change" listener to that quantity select input.
    quantityInputNode().addEventListener("change", (event) => {
      // Updates the object to save with a quantity property.
      dataToSave = { ...dataToSave, quantity: "" };

      const value = Number(event.target.value);

      // Generates error message if no quantity is selected.
      if (!value || value < 1 || value > 100) {
        errorMessageGenerator({
          node: quantityInputContainerNode(),
          id: "quantityError",
          type: "error",
          value: "Le nombre de produit ?? ajouter est manquant ou incorrect",
        });
      }

      // Removes the error message if a color is selected.
      if (value && value >= 1 && value <= 100) {
        removeErrorMessage("quantityError");

        // Updates the object to save with its previous state then the quantity selected.
        dataToSave = {
          ...dataToSave,
          quantity: value,
        };
      }
    });

    // Adds a "click" event listener the the addToCartBtn DOM element.
    addToCartBtnNode().addEventListener("click", () => {
      // Checks if the color or the quantity is missing. If so, animates the concerned messages related.

      if (!quantityErrorNode()) {
        // Generates error message if no quantity is selected.
        if (
          !dataToSave.quantity ||
          dataToSave.quantity < 1 ||
          dataToSave.quantity > 100
        ) {
          errorMessageGenerator({
            node: quantityInputContainerNode(),
            id: "quantityError",
            type: "error",
            value: "Le nombre de produit ?? ajouter est manquant ou incorrect",
          });
        }
      }
      if (!colorErrorNode()) {
        // Generates error message if no color is selected.
        if (!dataToSave.color) {
          errorMessageGenerator({
            node: colorInputContainerNode(),
            id: "colorError",
            type: "error",
            value: "La s??lection d'une couleur est obligatoire",
          });
        }
      }

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
        SnackBar("Item not added to your cart!", "error");
        return;
      }

      // Generates a SnackBar on the bottom right of the page to confirm the item has been added.
      SnackBar("Item added to your cart!", "success");

      // Updates the local storage with the new product.
      addToLocalStorage("cart", dataToSave);

      // Resets the top right icon.
      currentCartStateDetailsNode()?.remove();

      // Generates the top right CartIcon component if the cart exists.
      updateCartIcon();
    });
  } catch (error) {
    console.error(error);
  }
}
