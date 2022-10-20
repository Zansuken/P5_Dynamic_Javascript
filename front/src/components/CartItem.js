import {
  Article,
  Div,
  Image,
  Input,
  Paragraph,
  Title,
} from "./customComponents/customComponents.js";
import { cartContainerNode, singleTotalPriceNode } from "../constants.js";
import {
  clearLocalStorage,
  getLocalStorage,
  removeFromLocalStorage,
  updateSingleItem,
  updateTotalPriceQuantityDisplayed,
} from "../helpers/requests.js";

// Generate the CartList component.
// Steps:
// 1. Extracts props received from CartList.
// 2 .Extracts classes received from props.
// 3. Selects the related product.
// 4. Extracts the needed properties.
// 5. Initiates the total price/quantity variables.
// 6. Checks if the cart exists then loop through it to update the totals variables.
// 7. Builds the displayed value element and an input with the needed props.
// 8. Adds a data attribute to that input to identify it easily.
// 9. Adds a listener to that input:
//    9.1. Updates the single price and quantity displayed.
//    9.2. Updates the cart in local storage.
//    9.3. Updates the global total price and quantity displayed.
// 10. Builds the updatable quantity container.
// 11. Builds the remove button.
// 12. Adds a data attribute to that button to identify it easily.
// 13. Adds a listener to that button:
//    13.1. Set the data from the button.
//    13.2. Removes the targeted product from local storage.
//    13.3. Get the cart from local storage.
//    13.4. Select the related element of the DOM (in this case I'm using parentElement multiple times until I reach the top container).
//    13.5. Checks if the element exists then removes it.
//    13.6. Checks if the cart is empty, if so clears the local storage and removes the top container.
//    13.7. Updates the global total price and quantity displayed.
// 14. Builds the delete button container.
// 15. Builds the settings container.
// 16. Builds the different element for the description container.
// 17. Set the id of the price and updates it on page load.
// 18. Builds the description container.
// 19. Builds the content container.
// 20. Builds the image.
// 21. Builds the image container.
// 22. Builds the final article container.
// 23. Set the different data attributes needed.
// 24. Returns the article.

const CartItem = (props = { classes }) => {
  // 1.
  const {
    classes,
    itemId,
    itemColor,
    itemQuantity,
    itemPrice: productPrice,
    products,
    cart,
  } = props;
  // 2.
  const {
    root,
    image: imageClass,
    content,
    description,
    settings,
    settingsQuantity,
    quantity: quantityClass,
    settingsDelete,
    deleteButton,
  } = classes;

  // 3.
  const relatedItem = products.filter((product) => product._id === itemId)[0];

  // 4.
  const { name, price: itemPrice } = relatedItem;

  // 5.
  let globalTotalPrice = 0;
  let globalTotalQuantity = 0;

  // 6.
  cart?.forEach((item) => {
    if (item.id) {
      globalTotalPrice =
        Number(globalTotalPrice) + Number(item.price) * Number(item.quantity);
      globalTotalQuantity = Number(globalTotalQuantity) + Number(item.quantity);
    }
  });

  // 7.
  const quantity = Paragraph({ value: `Qté: ${itemQuantity}` });
  const input = Input({
    type: "number",
    name: "itemQuantity",
    min: 1,
    max: 100,
    value: itemQuantity,
    isCapitalized: true,
    classes: quantityClass,
  });

  // 8.
  input.setAttribute(
    "data-related-product",
    JSON.stringify({
      itemId,
      itemColor,
      itemQuantity,
    })
  );

  // 9.
  input.addEventListener("change", (event) => {
    const data = JSON.parse(event.target.dataset.relatedProduct);
    const displayedQuantityNode = event.target.previousSibling;

    // 9.1.
    displayedQuantityNode.innerText = `Qté: ${event.target.value}`;
    singleTotalPriceNode(itemId, itemColor).innerText = `${
      productPrice * event.target.value
    },00 €`;

    // 9.2.
    updateSingleItem("cart", {
      id: data.itemId,
      color: data.itemColor,
      quantity: event.target.value,
      price: productPrice,
    });

    // 9.3.
    updateTotalPriceQuantityDisplayed();
  });

  // 10.
  const itemQuantityContainer = Div(
    { classes: settingsQuantity },
    { quantity, input }
  );

  // 11.
  const deleteLabel = Paragraph({ classes: deleteButton, value: "Supprimer" });

  // 12.
  deleteLabel.setAttribute(
    "data-related-product",
    JSON.stringify({
      itemId,
      itemColor,
    })
  );

  // 13.
  deleteLabel.addEventListener("click", (event) => {
    // 13.1.
    const data = JSON.parse(event.target.dataset.relatedProduct);

    // 13.2.
    removeFromLocalStorage("cart", { id: data.itemId, color: itemColor });

    // 13.3.
    const cart = getLocalStorage("cart");

    // 13.4.
    const node =
      event.target.parentElement.parentElement.parentElement.parentElement;

    // 13.5
    if (node) {
      node.remove();
    }

    // 13.6.
    if (cart) {
      if (cart.length === 0) {
        clearLocalStorage();
        cartContainerNode().remove();
      }
    }
    // 13.7.
    updateTotalPriceQuantityDisplayed();
  });

  // 14.
  const itemDeleteContainer = Div({ classes: settingsDelete }, { deleteLabel });

  // 15.
  const itemSettingsContainer = Div(
    { classes: settings },
    { itemQuantityContainer, itemDeleteContainer }
  );

  // 16.
  const productName = Title({ type: 2, value: name });
  const color = Paragraph({ value: itemColor });
  const price = Paragraph({ value: `${itemPrice},00 €` });

  // 17.
  price.setAttribute("id", `${itemId}-${itemColor}`);
  price.setAttribute(
    "onload",
    (price.innerText = `${productPrice * itemQuantity},00 €`)
  );

  // 18.
  const itemDescriptionContainer = Div(
    { classes: description },
    { productName, color, price }
  );

  // 19.
  const itemContentContainer = Div(
    { classes: content },
    { itemDescriptionContainer, itemSettingsContainer }
  );

  // 20.
  const image = Image({
    src: relatedItem.imageUrl,
    alt: relatedItem.altTxt,
  });

  // 21.
  const itemImageContainer = Div({ classes: imageClass }, { image });

  // 22.
  const cartItem = Article(
    {
      classes: root,
    },
    { itemImageContainer, itemContentContainer }
  );

  // 23.
  cartItem.setAttribute("data-id", itemId);
  cartItem.setAttribute("data-color", itemColor);
  cartItem.setAttribute("data-quantity", itemQuantity);

  // 24.
  return cartItem;
};

export default CartItem;
