import CartList from "../components/CartList.js";
import { cartContainerNode, formNode, URL } from "../constants.js";
import {
  buildErrorMessage,
  finishLoading,
  getLocalStorage,
  getProductsData,
  hasNumber,
  isAddressValid,
  isValidCity,
  isValidEmail,
  orderIdGenerator,
  removeFormErrorMessage,
  sendOrder,
  startLoading,
} from "../helpers.js";

if (URL.includes("cart")) {
  try {
    startLoading(cartContainerNode(), true);

    const cart = getLocalStorage("cart");
    const cartSummary = getLocalStorage("cartSummary");
    const products = await getProductsData();

    if (cart) {
      CartList({ cart, products });
    }
    finishLoading();

    const form = formNode();

    form.addEventListener("submit", (event) => {
      const { elements } = form;

      const allInputs = {
        firstNameInput: elements["firstName"],
        lastNameInput: elements["lastName"],
        addressInput: elements["address"],
        cityInput: elements["city"],
        emailInput: elements["email"],
      };

      const allLabels = {
        firstNameLabel: elements["firstName"].name,
        lastNameLabel: elements["lastName"].name,
        addressLabel: elements["address"].name,
        cityLabel: elements["city"].name,
        emailLabel: elements["email"].name,
      };

      const allValues = {
        firstNameValue: elements["firstName"].value,
        lastNameValue: elements["lastName"].value,
        addressValue: elements["address"].value,
        cityValue: elements["city"].value,
        emailValue: elements["email"].value,
      };

      const {
        firstNameInput,
        lastNameInput,
        addressInput,
        cityInput,
        emailInput,
      } = allInputs;

      const {
        firstNameLabel,
        lastNameLabel,
        addressLabel,
        cityLabel,
        emailLabel,
      } = allLabels;

      const {
        firstNameValue,
        lastNameValue,
        addressValue,
        cityValue,
        emailValue,
      } = allValues;

      Object.values(allInputs).forEach((input) => {
        const { value } = input;
        switch (input) {
          case firstNameInput:
            if (hasNumber(value)) {
              buildErrorMessage(firstNameLabel, value, "contiens des chiffres");
              event.preventDefault();
            } else {
              removeFormErrorMessage(firstNameLabel);
            }
            break;
          case lastNameInput:
            if (hasNumber(value)) {
              buildErrorMessage(lastNameLabel, value, "contiens des chiffres");
              event.preventDefault();
            } else {
              removeFormErrorMessage(lastNameLabel);
            }
            break;
          case addressInput:
            if (cityInput.value) {
              isAddressValid(
                value,
                cityInput.value,
                addressLabel,
                value,
                addressInput
              );
            }
            break;
          case cityInput:
            if (!isValidCity(value)) {
              buildErrorMessage(cityLabel, value, "n'est pas une ville valide");
              event.preventDefault();
            } else {
              removeFormErrorMessage(cityLabel);
            }
            break;
          case emailInput:
            // Overkill checks because email input works well
            if (!isValidEmail(value)) {
              buildErrorMessage(emailLabel, value, "n'est pas un email valide");
              event.preventDefault();
            } else {
              removeFormErrorMessage(emailLabel);
            }
            break;

          default:
            break;
        }
      });
      const order = {
        orderId: orderIdGenerator(),
        contact: {
          firstName: firstNameValue,
          lastName: lastNameValue,
          address: addressValue,
          city: cityValue,
          email: emailValue,
        },
        items: cart,
        totals: cartSummary,
      };
      console.log(order);
      sendOrder(order);
      event.preventDefault();
    });
  } catch (error) {
    console.error(error);
  }
}
