import { orderIdNode, redirectToHomeBtnNode, URL } from "../constants.js";
import { OrderDetails } from "../components/customComponents/customComponents.js";
import {
  getProductsData,
  redirectToHomePage,
  clearLocalStorage,
} from "../helpers/requests.js";

if (URL.includes("confirmation")) {
  try {
    const products = await getProductsData();

    const orderIdURL = window.location.search;
    const searchOrderIdParams = new URLSearchParams(orderIdURL);
    const orderId = searchOrderIdParams.get("id");
    orderIdNode().innerText = orderId;
    OrderDetails(products);
    redirectToHomeBtnNode()?.addEventListener("click", () => {
      clearLocalStorage();
      redirectToHomePage();
    });
  } catch (error) {
    console.error(error.message);
  }
}
