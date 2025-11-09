import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function MarketplacePanel({ isDark }) {
  const products = [
    { id: 1, name: "Notes Summary Pack", seller: "Study Group", price: "₹99", rating: 4.5 },
    { id: 2, name: "Programming Tutorial Videos", seller: "Tech Academy", price: "₹299", rating: 4.8 },
    { id: 3, name: "Interview Prep Guide", seller: "Career Hub", price: "₹149", rating: 4.6 },
    { id: 4, name: "Competitive Coding Bundle", seller: "Code Masters", price: "₹199", rating: 4.7 },
  ];

  return (
    <div className={`${isDark ? "text-white" : "text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className={`p-4 rounded-lg shadow-md ${isDark ? "bg-gray-700" : "bg-white"}`}>
            <div className="mb-3 p-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg h-24 flex items-center justify-center">
              <ShoppingCartIcon className="h-10 w-10 text-white" />
            </div>
            <h3 className="font-bold text-sm mb-1">{product.name}</h3>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{product.seller}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-lg font-bold text-green-600">{product.price}</span>
              <span className="text-xs text-yellow-500">⭐ {product.rating}</span>
            </div>
            <button className="mt-3 w-full px-3 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
