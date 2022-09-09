import ProductCard from "../components/ProductCard.js";
import { URL } from "../constants.js";
import { finishLoading, getProductsData, startLoading } from "../helpers.js";

if (URL.includes("index")) {
  const productsContainer = document.querySelector("#items");
  try {
    startLoading(productsContainer, true);

    const products = await getProductsData();

    products.forEach((element) => {
      const { altTxt, description, imageUrl, name } = element;
      const href = `product.html?id=${element._id}`;

      productsContainer.append(
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
