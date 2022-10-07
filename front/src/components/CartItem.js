import {
  Article,
  cartContainerNode,
  Div,
  Image,
  Input,
  Paragraph,
  singleTotalPriceNode,
  Title,
} from "../constants.js";
import {
  clearLocalStorage,
  getLocalStorage,
  removeFromLocalStorage,
  updateSingleItem,
  updateTotalPriceQuantityDisplayed,
} from "../helpers.js";

const CartItem = (props = { classes }) => {
  const {
    classes,
    itemId,
    itemColor,
    itemQuantity,
    itemPrice: productPrice,
    products,
    cart,
  } = props;
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

  // Total price & total quantity update
  let globalTotalPrice = 0;
  let globalTotalQuantity = 0;

  cart?.forEach((item) => {
    if (item.id) {
      globalTotalPrice =
        Number(globalTotalPrice) + Number(item.price) * Number(item.quantity);
      globalTotalQuantity = Number(globalTotalQuantity) + Number(item.quantity);
    }
  });

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

  input.setAttribute(
    "data-related-product",
    JSON.stringify({
      itemId,
      itemColor,
      itemQuantity,
    })
  );

  input.addEventListener("change", (event) => {
    const data = JSON.parse(event.target.dataset.relatedProduct);
    const displayedQuantityNode = event.target.previousSibling;

    displayedQuantityNode.innerText = `Qté: ${event.target.value}`;
    singleTotalPriceNode(itemId, itemColor).innerText = `${
      productPrice * event.target.value
    },00 €`;

    updateSingleItem("cart", {
      id: data.itemId,
      color: data.itemColor,
      quantity: event.target.value,
      price: productPrice,
    });
    updateTotalPriceQuantityDisplayed();
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
    const node =
      event.target.parentElement.parentElement.parentElement.parentElement;

    if (node) {
      node.remove();
    }
    if (cart) {
      if (cart.length === 0) {
        clearLocalStorage();
        cartContainerNode().remove();
      }
    }
    updateTotalPriceQuantityDisplayed();
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

  price.setAttribute("id", `${itemId}-${itemColor}`);
  price.setAttribute(
    "onload",
    (price.innerText = `${productPrice * itemQuantity},00 €`)
  );

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
