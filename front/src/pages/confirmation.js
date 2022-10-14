import { orderIdNode, URL } from "../constants.js";
import { clearLocalStorage, getLocalStorage } from "../helpers.js";

if (URL.includes("confirmation")) {
  try {
    const orderId = getLocalStorage("orderId");
    orderIdNode().innerText = orderId;
    clearLocalStorage();
  } catch (error) {
    console.error(error.message);
  }
}
