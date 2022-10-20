import CartItem from "../components/CartItem.js";
import {
  cartContainerNode,
  globalTotalPriceNode,
  globalTotalQuantityNode,
} from "../constants.js";
import { formatToEuro } from "../helpers/other.js";
import { getCartSummary } from "../helpers/requests.js";

// Generate the CartList component.
// Steps:
// 1. Extracts the props.
// 2. Checks it there cart exits, if not stops there.
// 3. Loops through the cart.
// 4. Checks if the product has an id.
// 5. Call the CartItem component for each product in the cart.
// 6. Add the component to the DOM (cartContainerNode is a function that returns the targeted DOM element).
// 7. Extracts the overall totals (quantity and price) of the "cartSummary" key in local storage.
// 8. Updates the displayed text of the concerned elements in the DOM (and format the price to €).

const CartList = (props = { cart, products }) => {
  // 1.
  const { cart, products } = props;

  // 2.
  if (!cart) {
    return;
  }

  // 3.
  cart.forEach((item) => {
    // 4.
    if (item.id) {
      // 5.
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
      // 6.
      cartContainerNode().append(cartItem);
    }
  });

  // 7.
  const { totalQuantity, totalPrice } = getCartSummary();

  // 8.
  globalTotalPriceNode().innerText = formatToEuro(totalPrice);
  globalTotalQuantityNode().innerText = totalQuantity;
};

export default CartList;
