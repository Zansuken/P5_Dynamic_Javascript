import CartItem from "../components/CartItem.js";

const CartList = (props = { cart, products }) => {
  const cartContainer = document.querySelector("#cart__items");
  const globalTotalPriceNode = document.querySelector("#totalPrice");
  const globalTotalQuantityNode = document.querySelector("#totalQuantity");

  let totalPrice = 0;
  let totalQuantity = 0;

  const { cart, products } = props;

  if (!cart) {
    return;
  }

  cart.forEach((item) => {
    if (item.id) {
      totalPrice =
        Number(totalPrice) + Number(item.price) * Number(item.quantity);
      totalQuantity = Number(totalQuantity) + Number(item.quantity);

      const cartItem = CartItem({
        classes: {
          root: "cart__item",
          image: "cart__item__img",
          content: "cart__item__content",
          description: "cart__item__content__description",
          settings: "cart__item__content__settings",
          settingsQuantity: "cart__item__content__settings__quantity",
          quantity: "itemQuantity",
          settingsDelete: "cart__item__content__settings__delete",
          deleteButton: "deleteItem",
        },
        itemId: item.id,
        itemColor: item.color,
        itemQuantity: item.quantity,
        itemPrice: item.price,
        products,
        cart,
      });
      cartContainer.append(cartItem);
    }
  });
  globalTotalPriceNode.innerText = totalPrice;
  globalTotalQuantityNode.innerText = totalQuantity;
};

export default CartList;
