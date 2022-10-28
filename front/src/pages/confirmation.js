import { orderIdNode, URL } from "../constants.js";
import { OrderDetails } from "../components/customComponents/customComponents.js";
import {
  getProductsData,
  clearLocalStorage,
  getLocalStorage,
} from "../helpers/requests.js";

// Checks if we are on the confirmation page.
if (URL.includes("confirmation")) {
  try {
    const cart = getLocalStorage("cart");

    if (!cart) {
      redirectToHomePage();
    }
    // Fetch all the products from the API.
    const products = await getProductsData();

    // Gets the url parameters.
    const orderIdURL = window.location.search;

    // Sets the parameter research.
    const searchOrderIdParams = new URLSearchParams(orderIdURL);

    // Gets the orderId value from its parameter.
    const orderId = searchOrderIdParams.get("id");

    // Updates the orderId DOM element.
    orderIdNode().innerText = orderId;

    // Builds the OrderDetails component.
    OrderDetails(products);
    clearLocalStorage();
  } catch (error) {
    console.error(error.message);
  }
}
