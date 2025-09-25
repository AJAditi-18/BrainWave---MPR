import React from 'react';
import Navbar from "../components/Layout/navbar";
import ProductCard from '../components/Marketplace/ProductCard';

const products = [
  { image: "https://www.drawkit.com/images/education/book.svg", title: "Learn React", description: "Interactive course", price: 37 },
  { image: "https://www.drawkit.com/images/education/brain.svg", title: "CCNA Guide", description: "Network Security", price: 19 }
];

const Marketplace = () => (
  <>
    <Navbar />
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {products.map(product => <ProductCard key={product.title} product={product} />)}
    </div>
  </>
);

export default Marketplace;
