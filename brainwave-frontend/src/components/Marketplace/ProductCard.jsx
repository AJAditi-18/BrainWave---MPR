import React from 'react';
import Card from '../common/card';
import Button from '../common/Button';

const ProductCard = ({ product }) => (
  <Card className="flex flex-col justify-between h-full">
    <img src={product.image} alt={product.title} className="h-32 w-full object-cover" />
    <div className="mt-2">
      <h4 className="text-base font-bold text-brainwave-primary">{product.title}</h4>
      <p className="text-gray-600 text-sm">{product.description}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-lg font-semibold text-brainwave-accent">${product.price}</span>
        <Button size="sm">Buy</Button>
      </div>
    </div>
  </Card>
);

export default ProductCard;
