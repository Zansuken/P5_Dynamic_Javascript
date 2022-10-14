import { confirmationContainerNode, orderIdNode, URL } from "../constants.js";
import { OrderDetails } from "../customComponents.js";
import { clearLocalStorage, getProductsData } from "../helpers.js";

if (URL.includes("confirmation")) {
  try {
    const products = await getProductsData();

    const orderIdURL = window.location.search;
    const searchOrderIdParams = new URLSearchParams(orderIdURL);
    const orderId = searchOrderIdParams.get("id");
    orderIdNode().innerText = orderId;
    confirmationContainerNode().appendChild(OrderDetails(products));
    clearLocalStorage();
  } catch (error) {
    console.error(error.message);
  }
}
