import { Article, Image, Link, Paragraph, Title } from "../customComponents.js";

const ProductCard = (props = { data, alt, href, img, name, description }) => {
  const { alt, href, img, name, description } = props;

  const image = Image({
    src: img,
    alt,
  });

  const h3 = Title({ type: 3, value: name });

  const p = Paragraph({ value: description });

  const article = Article({}, { image, h3, p });

  if (href) {
    const a = Link({ href });
    a.append(article);
    return a;
  }

  return article;
};

export default ProductCard;
