"use client";

import { useState, useMemo } from "react";
import { Search, ShoppingCart, User, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// Mock data for products
const products = [
  {
    id: 1,
    name: "Sports Shoe 1",
    category: "Footwear",
    price: 100,
    rating: 4.5,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Sports Shoe 2",
    category: "Footwear",
    price: 120,
    rating: 4.2,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Smartwatch",
    category: "Watch",
    price: 150,
    rating: 4.8,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "T-Shirt",
    category: "Clothing",
    price: 30,
    rating: 4.0,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    name: "Backpack",
    category: "Accessories",
    price: 50,
    rating: 4.3,
    image: "/placeholder.svg?height=100&width=100",
  },
];

export function ProductSearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Dynamically generate categories from product data
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      products.map((product) => product.category)
    );
    return ["All", ...Array.from(uniqueCategories)];
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "All" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-2 mb-6">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="font-bold mt-1">${product.price.toFixed(2)}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm ml-1">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <Button>Add to Cart</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
