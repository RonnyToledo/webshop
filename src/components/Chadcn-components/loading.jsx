"use client";
import React from "react";

export default function Loading({ loading }) {
  return (
    <div className="absolute inset-0 bg-white flex items-center justify-center">
      <div className=" p-4 bg-gradient-to-tr animate-spin from-green-500 to-blue-500 via-purple-500 rounded-full">
        <div className="bg-white rounded-full">
          <div className="w-24 h-24 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
