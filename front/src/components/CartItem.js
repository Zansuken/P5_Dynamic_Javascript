import { Article, Div, Image, Input, Paragraph, Title } from "../constants.js";

const CartItem = (props = { classes, relatedItem }) => {
  const { classes, relatedItem } = props;
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

  const {
    id,
    color: itemColor,
    quantity: itemQuantity,
    name,
    price: itemPrice,
  } = relatedItem;

  console.log(props);

  const image = Image({
    src: relatedItem.imageUrl,
    alt: relatedItem.altTxt,
  });

  const itemImageContainer = Div({ classes: imageClass }, { image });

  const itemContentContainer = Div({ classes: content });

  const itemSettingsContainer = Div({ classes: settings });

  const itemQuantityContainer = Div({ classes: settingsQuantity });

  const itemDeleteContainer = Div({ classes: settingsDelete });

  const productName = Title({ type: 2, value: name });
  const color = Paragraph({ value: itemColor });
  const price = Paragraph({ value: itemPrice });

  const itemDescriptionContainer = Div(
    { classes: description },
    { productName, color, price }
  );
  console.log("itemDescriptionContainer: ", itemDescriptionContainer);

  const quantity = Paragraph();
  const deleteLabel = Paragraph({ classes: deleteButton });

  const input = Input({
    type: "number",
    name: "itemQuantity",
    min: 1,
    max: 100,
    value,
    isCapitalized: true,
    classes: quantityClass,
  });

  const cartItem = Article(
    {
      classes: root,
    },
    { itemImageContainer }
  );

  return cartItem;
};

export default CartItem;
