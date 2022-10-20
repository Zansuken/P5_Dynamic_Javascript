import { displayedErrorNode } from "../constants.js";
import { Paragraph } from "../customComponents.js";
import { getRelatedInput } from "../constants.js";

// -- Builders -- //

// Generate error message
export const errorMessageGenerator = (props = { node, id, type, value }) => {
  const { node, id, type, value } = props;

  const errorElement = Paragraph({
    id,
    type,
    value,
  });

  node.after(errorElement);
};

// Remove error message
export const removeErrorMessage = (id) => {
  if (displayedErrorNode(id)) {
    displayedErrorNode(id).remove();
  }
};

// Build the error message form
export const buildErrorMessage = (label, value, message) => {
  const errorRecipient = getRelatedInput(label);
  errorRecipient.innerText = `${value} ${message}!`;
};

// Remove the error message form
export const removeFormErrorMessage = (label) => {
  const errorRecipient = getRelatedInput(label);
  if (errorRecipient) {
    errorRecipient.innerText = "";
  }
  return;
};

// Concatenate children nodes (for custom components)
export const addChildren = (node, children) => {
  Object.keys(children).forEach((key) => {
    node.append(children[key]);
  });
};

// Change the display of CartState depending its previous state
export const cartStateSwitch = ({
  elementToHide,
  elementToShow,
  elementGenerator,
  cart,
  products,
  isDefaultState,
}) => {
  // If element is displayed we add a listener on click
  elementToHide?.addEventListener("click", () => {
    // Add a class that changes the display prop to "none"
    elementToHide?.classList.add("hide");
    // Depending on which state we show only the icon or the cart details
    if (isDefaultState) {
      elementGenerator(cart, products);
    } else {
      elementGenerator(cart.length, cart, products);
    }
    // Add a class that changes the display prop to "flex" on top of "hide" className
    elementToShow?.classList.add("show");
  });
};
