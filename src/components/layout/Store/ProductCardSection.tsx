import React from "react";
import ProductCard from "./ProductCard";

const ProductCardSection = () => {
     const products = [
  {
    shopName: "Green Store",
    shopSubtitle: "Organic Goods",
    productImg: "/store img/1.jpg",
    productName: "Organic Apple",
    productPrice: 3.99,
    productSubtitle: "Fresh and juicy",
    productDescription: "Grown organically without pesticides.",
  },
  {
    shopName: "Tech Hub",
    shopSubtitle: "Electronics",
    productImg: "/store img/2.jpg",
    productName: "Wireless Headphones",
    productPrice: 59.99,
    productSubtitle: "Noise-cancelling",
    productDescription: "High-quality sound with long battery life.",
  },
  {
    shopName: "Fashion Point",
    shopSubtitle: "Clothing",
    productImg: "/store img/3.jpg",
    productName: "Denim Jacket",
    productPrice: 49.99,
    productSubtitle: "Stylish wear",
    productDescription: "Classic fit, perfect for all seasons.",
  },
  {
    shopName: "Book World",
    shopSubtitle: "Books & Stationery",
    productImg: "/store img/4.jpg",
    productName: "The Great Novel",
    productPrice: 14.99,
    productSubtitle: "Bestseller",
    productDescription: "A thrilling story that captivates readers.",
  },
  {
    shopName: "Toy Land",
    shopSubtitle: "Kids",
    productImg: "/store img/5.jpg",
    productName: "Building Blocks Set",
    productPrice: 29.99,
    productSubtitle: "Creative Play",
    productDescription: "Encourages creativity and problem-solving.",
  },
  {
    shopName: "Green Store",
    shopSubtitle: "Organic Goods",
    productImg: "/store img/6.jpg",
    productName: "Fresh Carrots",
    productPrice: 2.99,
    productSubtitle: "Crunchy & Healthy",
    productDescription: "Grown naturally without chemicals.",
  },
  {
    shopName: "Tech Hub",
    shopSubtitle: "Electronics",
    productImg: "/store img/7.jpg",
    productName: "Smartwatch",
    productPrice: 99.99,
    productSubtitle: "Fitness Tracker",
    productDescription: "Track your health and notifications easily.",
  },
  {
    shopName: "Fashion Point",
    shopSubtitle: "Clothing",
    productImg: "/store img/8.jpg",
    productName: "Running Shoes",
    productPrice: 69.99,
    productSubtitle: "Comfortable & Durable",
    productDescription: "Perfect for sports and daily wear.",
  },
  {
    shopName: "Book World",
    shopSubtitle: "Books & Stationery",
    productImg: "/store img/9.jpg",
    productName: "Notebook Set",
    productPrice: 9.99,
    productSubtitle: "Stationery Essentials",
    productDescription: "High-quality paper, ideal for notes.",
  },
  {
    shopName: "Toy Land",
    shopSubtitle: "Kids",
    productImg: "/store img/10.jpg",
    productName: "Puzzle Game",
    productPrice: 19.99,
    productSubtitle: "Brain Teaser",
    productDescription: "Fun and challenging for all ages.",
  },
];

  return (
    <section>
      <div className="w-[80%] mx-auto">
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
          {products.map((product, index) => (
              
          <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCardSection;
