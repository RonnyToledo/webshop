"use client";

import Image from "next/image";
import { Minus, Plus, ArrowLeft, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ShoppingCartComponent() {
  const cartItems = [
    {
      id: 1,
      name: "Nike Air Max 270",
      price: 150,
      quantity: 1,
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Adidas Ultraboost",
      price: 180,
      quantity: 2,
      image: "/placeholder.svg",
    },
  ];

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow p-4 space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-4 flex items-center space-x-4 shadow-sm"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={80}
              height={80}
              className="rounded-xl object-cover"
            />
            <div className="flex-grow">
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-blue-600 font-bold">
                ${item.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center">{item.quantity}</span>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="icon" variant="ghost" className="text-red-500">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        ))}

        <div className="bg-white rounded-2xl p-4 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Label htmlFor="payment-type" className="text-sm font-medium">
              Payment Type
            </Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit-card">Credit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="delivery" className="text-sm font-medium">
              Delivery
            </Label>
            <Switch id="delivery" />
          </div>
        </div>
      </main>
      <footer className="bg-white p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total</span>
          <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
        </div>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          Proceed to Checkout
        </Button>
      </footer>
    </div>
  );
}
