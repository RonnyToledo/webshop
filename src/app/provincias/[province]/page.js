"use client";
import React, { useContext } from "react";
import Image from "next/image";

export default function usePage({ params }) {
  return (
    <>
      <div className="w-full">
        <Image
          alt={"Store"}
          className="w-full h-[400px] object-cover"
          height={400}
          src={
            "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
          }
          style={{
            aspectRatio: "1920/400",
            objectFit: "cover",
          }}
          width={1920}
        />
      </div>
      <main className="w-full p-4 bg-gray-100"></main>
    </>
  );
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
