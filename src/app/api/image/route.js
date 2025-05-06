import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function OPTIONS() {
  // Responde al preflight
  return NextResponse.json(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:8081",
      "Access-Control-Allow-Methods": "PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function PUT(request, { params }) {
  const data = await request.formData();
  const image = data.get("image");
  //Si tenemos imagen nueva
  if (image) {
    //Subimos la nueva
    const byte = await image.arrayBuffer();
    const buffer = Buffer.from(byte);
    const res = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        })
        .end(buffer);
    });

    const response = NextResponse.json(
      { message: "Upload OK", image: uploadResult.secure_url },
      { status: 200 }
    );
    // **añade también** CORS aquí
    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:8081"
    );
    return response;
  }
  return NextResponse.json(
    {
      message: "Error",
      image: res.secure_url,
    },
    {
      status: 404,
    }
  );
}
