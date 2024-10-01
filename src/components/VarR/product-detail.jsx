"use client";

import Image from "next/image";
import { Star, Heart, ShoppingCart, ArrowLeft, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProductDetailComponent() {
  const isInStock = true; // This would be dynamically set based on actual product data

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow p-4 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm relative">
          <Image
            src="/placeholder.svg"
            alt="Product Image"
            width={400}
            height={400}
            className="w-full h-64 object-cover rounded-2xl"
          />
          <Badge
            className={`absolute top-8 right-8 ${
              isInStock ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {isInStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Nike Air Max 270</h2>
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">4.5</span>
            </div>
          </div>
          <p className="text-gray-600">
            The Nike Air Max 270 delivers a plush ride and modern look. The Max
            Air 270 unit provides all-day comfort while the sleek upper design
            adds a stylish touch.
          </p>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-blue-600">$150.00</span>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                -
              </Button>
              <span className="flex items-center justify-center w-8 h-8 border rounded-md">
                1
              </span>
              <Button size="sm" variant="outline">
                +
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white p-4">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
          disabled={!isInStock}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isInStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </footer>
    </div>
  );
}
