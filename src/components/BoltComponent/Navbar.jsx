import React from "react";
import { ShoppingBag } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="backdrop-blur-xl shadow-lg sticky top-0  z-50">
      <div className=" mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-gray-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                R&H || Boulevard
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4"></div>
        </div>
      </div>
    </nav>
  );
}
