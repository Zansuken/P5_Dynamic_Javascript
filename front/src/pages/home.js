import { updateCartIcon } from "../components/CartState.js";
import ProductCard from "../components/ProductCard.js";
import { productsContainerNode, URL } from "../constants.js";
import { finishLoading, startLoading } from "../helpers/animations.js";
import { getProductsData } from "../helpers/requests.js";

if (URL.includes("index")) {
  try {
    updateCartIcon();

    startLoading(productsContainerNode(), true);

    const products = await getProductsData();

    products.forEach((element) => {
      const { altTxt, description, imageUrl, name } = element;
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
    finishLoading();
  } catch (error) {
    console.error(error);
  }
}
