import { Article, Div, Image, Input, Paragraph, Title } from "../constants.js";

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

  return cartItem;
};

export default CartItem;
