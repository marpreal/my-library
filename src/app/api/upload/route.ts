import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface CloudinaryUploadResponse {
  secure_url: string;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadedImage: CloudinaryUploadResponse = await new Promise(
      (resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream({ folder: "profile_pictures" }, (error, result) => {
            if (error || !result) reject(new Error("Upload failed"));
            else resolve(result as CloudinaryUploadResponse);
          })
          .end(buffer);
      }
    );

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { image: uploadedImage.secure_url },
      select: { image: true },
    });

    return NextResponse.json({ imageUrl: updatedUser.image });
  } catch (error) {
    return NextResponse.json(
      { error: "Image upload failed", details: (error as Error).message },
      { status: 500 }
    );
  }
}
