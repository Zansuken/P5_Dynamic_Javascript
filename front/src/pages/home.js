import { updateCartIcon } from "../components/CartState.js";
import ProductCard from "../components/ProductCard.js";
import { productsContainerNode, URL } from "../constants.js";
import { finishLoading, startLoading } from "../helpers/animations.js";
import { getProductsData } from "../helpers/requests.js";

// Checks if we are on the home page.
if (URL.includes("index")) {
  try {
    // Generates the top right CartIcon component if the cart exists.
    updateCartIcon();

    // Add a loading spinner.
    startLoading(productsContainerNode(), true);

    // Fetch all the products from the API.
    const products = await getProductsData();

    // Loops through the products and generates a ProductCard with the needed props.
    products.forEach((element) => {
      const { altTxt, description, imageUrl, name } = element;

      // Builds the url linked to the product to redirect to "product.html" page with the product id as parameter.
      const href = `product.html?id=${element._id}`;

      productsContainerNode().append(
        ProductCard({
          data: products,
          alt: altTxt,
          href,
          description,
          img: imageUrl,
          name,
        })
      );
    });

    // Removes the loading spinner.
    finishLoading();
  } catch (error) {
    console.error(error);
  }
}
