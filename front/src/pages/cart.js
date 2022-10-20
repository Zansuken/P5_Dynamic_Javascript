import CartList from "../components/CartList.js";
import {
  cartContainerNode,
  formNode,
  submitBtnNode,
  URL,
} from "../constants.js";
import {
  checkStreet,
  hasNumber,
  isValidCity,
  isValidEmail,
} from "../helpers/validations.js";
import { startLoading, finishLoading } from "../helpers/animations.js";
import {
  buildErrorMessage,
  removeFormErrorMessage,
} from "../helpers/builders.js";
import {
  getProductsData,
  sendOrder,
  getLocalStorage,
} from "../helpers/requests.js";

if (URL.includes("cart")) {
  try {
    startLoading(cartContainerNode(), true);
    const cart = getLocalStorage("cart");
    const cartSummary = getLocalStorage("cartSummary");
    const products = await getProductsData();
    submitBtnNode().removeAttribute("disabled");
    if (cart) {
      CartList({ cart, products });
    } else {
      submitBtnNode().setAttribute("disabled", "");
    }
    finishLoading();

    const form = formNode();

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const { elements } = form;

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

      const contact = {
        firstName: firstNameValue,
        lastName: lastNameValue,
        address: addressValue,
        city: cityValue,
        email: emailValue,
      };

      // Wait the result of the address check from GeoApi to trigger or not submit
      Promise.all([checkStreet(addressValue, cityValue)]).then((result) => {
        let formIsValid = true;
        if (result[0] === "unknownAddress") {
          buildErrorMessage(
            addressLabel,
            addressValue,
            "n'est pas une adresse connue"
          );
        }
        if (result[0] === "cityAndStreetNoMatch") {
          buildErrorMessage(
            addressLabel,
            addressValue,
            "n'existe pas dans la ville entrée"
          );
        }

        if (hasNumber(firstNameValue)) {
          buildErrorMessage(
            firstNameLabel,
            firstNameValue,
            "contiens des chiffres"
          );
          formIsValid = false;
        } else {
          removeFormErrorMessage(firstNameLabel);
        }

        if (hasNumber(lastNameValue)) {
          buildErrorMessage(
            lastNameLabel,
            lastNameValue,
            "contiens des chiffres"
          );
          formIsValid = false;
        } else {
          removeFormErrorMessage(lastNameLabel);
        }

        if (!isValidCity(cityValue)) {
          buildErrorMessage(cityLabel, cityValue, "n'est pas une ville valide");
          formIsValid = false;
        } else {
          removeFormErrorMessage(cityLabel);
        }

        // Overkill checks because email input works well
        if (!isValidEmail(emailValue)) {
          buildErrorMessage(
            emailLabel,
            emailValue,
            "n'est pas un email valide"
          );
          formIsValid = false;
        } else {
          removeFormErrorMessage(emailLabel);
        }

        if (result[0] === "" && formIsValid) {
          removeFormErrorMessage(addressLabel);
          sendOrder(contact, cartSummary);
          form.submit();
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}
