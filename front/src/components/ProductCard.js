import {
  Article,
  Image,
  Link,
  Paragraph,
  Title,
} from "./customComponents/customComponents.js";

// Generate the ProductCard component.
// Steps:
// 1. Use destructuring to extract props that comes from home.js (home page) where it's used.
// 2. Build the image with a custom component, "src" is mandatory, "alt" is not but generate a warning if missing.
// 3. Build the title (specifically h3 set with the "type" props) with a custom component.
// 4. Build the p element.
// 5. Build the article by passing the children (the three components above) as "children" props.
// 6. If there is a href we're adding a link component as the article parent.
// 7. Return the constructed component.

const ProductCard = (props = { data, alt, href, img, name, description }) => {
  // 1.
  const { alt, href, img, name, description } = props;

  // 2.
  const image = Image({
    src: img,
    alt,
  });

  // 3.
  const h3 = Title({ type: 3, value: name });

  // 4.
  const p = Paragraph({ value: description });

  // 5.
  const article = Article({}, { image, h3, p });

  // 6.
  if (href) {
    const a = Link({ href });
    a.append(article);
    return a;
  }

  // 7.
  return article;
};

export default ProductCard;
