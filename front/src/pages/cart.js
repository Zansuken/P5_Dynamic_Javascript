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

// Checks if we are on the cart page.
if (URL.includes("cart")) {
  try {
    // Add a loading spinner.
    startLoading(cartContainerNode(), true);

    // Get the cart and the cartSummary from local storage.
    const cart = getLocalStorage("cart");
    const cartSummary = getLocalStorage("cartSummary");

    // Fetch all the products from the API.
    const products = await getProductsData();

    // Removes the "disabled" attribute from the submit button.
    submitBtnNode().removeAttribute("disabled");

    // If the cart exists, builds the list to display.
    if (cart) {
      CartList({ cart, products });
    } else {
      // If the cart doesn't exists add a "disabled" attribute to the submit button.
      submitBtnNode().setAttribute("disabled", "");
    }

    // Removes the loading spinner.
    finishLoading();

    // Select the form element.
    const form = formNode();

    // Adds a "submit" type listener to the form.
    form.addEventListener("submit", (event) => {
      // Stops default event behavior when submit.
      event.preventDefault();

      // Extracts children nodes from the form.
      const { elements } = form;

      // Structures the different labels in an object.
      const allLabels = {
        firstNameLabel: elements["firstName"].name,
        lastNameLabel: elements["lastName"].name,
        addressLabel: elements["address"].name,
        cityLabel: elements["city"].name,
        emailLabel: elements["email"].name,
      };

      // Structures the different values in an object.
      const allValues = {
        firstNameValue: elements["firstName"].value,
        lastNameValue: elements["lastName"].value,
        addressValue: elements["address"].value,
        cityValue: elements["city"].value,
        emailValue: elements["email"].value,
      };

      // Extracts the labels with destructuring.
      const {
        firstNameLabel,
        lastNameLabel,
        addressLabel,
        cityLabel,
        emailLabel,
      } = allLabels;

      // Extracts the values with destructuring.
      const {
        firstNameValue,
        lastNameValue,
        addressValue,
        cityValue,
        emailValue,
      } = allValues;

      // Builds the contact object to send.
      const contact = {
        firstName: firstNameValue,
        lastName: lastNameValue,
        address: addressValue,
        city: cityValue,
        email: emailValue,
      };

      // Wait the result of the address check from GeoApi to trigger or not submit.
      // Each check has its own error message.
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
