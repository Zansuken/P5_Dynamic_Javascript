import { Article, Div, Image, Input, Paragraph, Title } from "../constants.js";
import {
  clearLocalStorage,
  getLocalStorage,
  removeFromLocalStorage,
} from "../helpers.js";
import CartList from "./CartList.js";

const CartItem = (props = { classes }) => {
  const { classes, itemId, itemColor, itemQuantity, products } = props;
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

  const relatedItem = products.filter((product) => product._id === itemId)[0];

  const { name, price: itemPrice } = relatedItem;

  // Quantity container
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
  const itemQuantityContainer = Div(
    { classes: settingsQuantity },
    { quantity, input }
  );
  // Delete button container
  const deleteLabel = Paragraph({ classes: deleteButton, value: "Remove" });

  deleteLabel.setAttribute(
    "data-related-product",
    JSON.stringify({
      itemId,
      itemColor,
    })
  );

  deleteLabel.addEventListener("click", (event) => {
    const data = JSON.parse(event.target.dataset.relatedProduct);
    removeFromLocalStorage("cart", { id: data.itemId, color: itemColor });
    const cart = getLocalStorage("cart");
    const cartContainer = document.querySelector("#cart__items");
    const nodeList = cartContainer.children.item;
    console.log(nodeList);
    nodeList.map((node) => {
      console.log(node);
    });

    if (cart) {
      console.log(cart);
      if (cart.length === 0) {
        clearLocalStorage();
        // cartContainer.remove();
      }

      // CartList({ cart, products });
    }
  });

  const itemDeleteContainer = Div({ classes: settingsDelete }, { deleteLabel });

  // Setting container
  const itemSettingsContainer = Div(
    { classes: settings },
    { itemQuantityContainer, itemDeleteContainer }
  );

  // Description container
  const productName = Title({ type: 2, value: name });
  const color = Paragraph({ value: itemColor });
  const price = Paragraph({ value: `${itemPrice},00 €` });

  const itemDescriptionContainer = Div(
    { classes: description },
    { productName, color, price }
  );

  // Content container
  const itemContentContainer = Div(
    { classes: content },
    { itemDescriptionContainer, itemSettingsContainer }
  );

  // Image container
  const image = Image({
    src: relatedItem.imageUrl,
    alt: relatedItem.altTxt,
  });

  const itemImageContainer = Div({ classes: imageClass }, { image });

  // Final Article
  const cartItem = Article(
    {
      classes: root,
    },
    { itemImageContainer, itemContentContainer }
  );

  cartItem.setAttribute(
    "data-related-product",
    JSON.stringify({
      itemId,
      itemColor,
    })
  );

  return cartItem;
};

export default CartItem;
