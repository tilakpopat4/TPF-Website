import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getAdminSession } from "@/lib/auth";

const f = createUploadthing();

// Security guard: Ensure only authenticated admin can initiate uploads
async function requireAdminUploadAuth() {
  const session = await getAdminSession();
  if (!session) {
    throw new UploadThingError("Unauthorized: Admin authentication required to upload media files.");
  }
  return { uploadedBy: session.u };
}

// FileRouter for your app, protected with admin session verification
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "128MB" } })
    .middleware(async () => {
      return await requireAdminUploadAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.uploadedBy, fileUrl: file.url };
    }),
    
  videoUploader: f({ video: { maxFileSize: "2GB" } })
    .middleware(async () => {
      return await requireAdminUploadAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.uploadedBy, fileUrl: file.url };
    }),
    
  audioUploader: f({ audio: { maxFileSize: "128MB" } })
    .middleware(async () => {
      return await requireAdminUploadAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.uploadedBy, fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
