"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Store,
  Users,
  Package,
  Truck,
  Mail,
  Phone,
  MapPin,
  Star,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AboutStoreComponent() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow p-4 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm text-center">
          <Image
            src="/placeholder.svg"
            alt="Store Logo"
            width={120}
            height={120}
            className="rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">FashionFusion</h2>
          <p className="text-blue-600 font-semibold mb-4">
            Your One-Stop Fashion Destination
          </p>
          <p className="text-gray-600 mb-4">
            Founded in 2010, FashionFusion has been at the forefront of online
            fashion retail. We curate the latest trends and timeless classics to
            bring you a diverse range of stylish clothing and accessories.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold mb-2">Our Values</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
              <Store className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-center">
                Quality Products
              </span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-center">
                Customer First
              </span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
              <Package className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-center">
                Sustainable Packaging
              </span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
              <Truck className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-center">
                Fast Delivery
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <span>support@fashionfusion.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-blue-600" />
            <span>+1 (800) 123-4567</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>123 Fashion Street, New York, NY 10001</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
          <div className="space-y-4">
            {[
              {
                name: "Alex",
                comment: "Great selection and fast shipping!",
                rating: 5,
              },
              {
                name: "Sam",
                comment: "Love the quality of their products!",
                rating: 4,
              },
              {
                name: "Jamie",
                comment: "Excellent customer service!",
                rating: 5,
              },
            ].map((review, index) => (
              <div key={index} className="flex items-start space-x-4">
                <Avatar>
                  <AvatarFallback>{review.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">{review.name}</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold mb-2">Store Hours</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { day: "Monday", hours: "9:00 AM - 8:00 PM" },
              { day: "Tuesday", hours: "9:00 AM - 8:00 PM" },
              { day: "Wednesday", hours: "9:00 AM - 8:00 PM" },
              { day: "Thursday", hours: "9:00 AM - 8:00 PM" },
              { day: "Friday", hours: "9:00 AM - 9:00 PM" },
              { day: "Saturday", hours: "10:00 AM - 9:00 PM" },
              { day: "Sunday", hours: "11:00 AM - 6:00 PM" },
            ].map((schedule, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium">{schedule.day}</p>
                  <p className="text-sm text-gray-600">{schedule.hours}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
