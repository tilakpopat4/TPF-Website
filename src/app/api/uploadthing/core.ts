import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "16MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for image");
      console.log("file url", file.url);
      return { uploadedBy: "admin" };
    }),
    
  videoUploader: f({ video: { maxFileSize: "2GB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for video");
      console.log("file url", file.url);
      return { uploadedBy: "admin" };
    }),
    
  audioUploader: f({ audio: { maxFileSize: "128MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for audio");
      console.log("file url", file.url);
      return { uploadedBy: "admin" };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
