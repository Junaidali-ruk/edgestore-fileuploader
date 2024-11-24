"use client";

import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import Link from "next/link";
import { SetStateAction, useState } from "react";

export default function Page() {
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [urls, setUrls] = useState<{
    url: string;
    thumbnailUrl: string | null;
  }>();
  const { edgestore } = useEdgeStore();

  const handleFileChange = (file: File | undefined) => {
    setFile(file);
    if (file) {
      // Generate a preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-black text-white">
      <div className="w-full h-screen bg-gray-900 rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-6">
        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 border-r p-4">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-6">Upload Your Image</h1>
          <p className="text-center text-gray-400 mb-6">
            Upload an image and get instant links to view it or its thumbnail.
          </p>

          {/* Dropzone */}
          <SingleImageDropzone
            width={200}
            height={200}
            value={file}
            dropzoneOptions={{
              maxSize: 1024 * 1024 * 1, // 1MB
            }}
            onChange={handleFileChange}
            className="w-full h-52 flex m-auto items-center justify-center border-2 border-dashed border-gray-500 bg-gray-800 rounded-lg hover:border-blue-500 transition-all"
          />

          {/* Render Progress and Button only if file is selected */}
          {file && (
            <>
              {/* Progress Bar */}
              <div className="mt-4 h-3 w-full bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-150"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              {/* Upload Button */}
              <button
                className={`mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-transform transform hover:scale-105`}
                onClick={async () => {
                  if (file) {
                    const res = await edgestore.myPublicImages.upload({
                      file,
                      input: { type: "post" },
                      onProgressChange: (progress: SetStateAction<number>) => setProgress(progress),
                    });
                    setUrls({
                      url: res.url,
                      thumbnailUrl: res.thumbnailUrl,
                    });
                  }
                }}
              >
                Upload Image
              </button>
            </>
          )}
        </div>

        {/* Right Section - Preview */}
        {file && (
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
            {previewUrl ? (
              <div className="relative w-full max-w-xs h-64 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={previewUrl}
                  alt="Image Preview"
                  className="w-full h-full object-cover"
                />
                <p className="absolute top-0 left-0 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded-br">
                  Preview
                </p>
              </div>
            ) : (
              <p className="text-gray-400 text-center">
                Image preview will appear here after selection.
              </p>
            )}

            {/* Uploaded Links */}
            {urls && (
              <div className="mt-6 space-y-2 text-center">
                {urls?.url && (
                  <Link
                    href={urls.url}
                    target="_blank"
                    className="block text-blue-400 underline hover:text-blue-300 transition-colors"
                  >
                    View Full Image
                  </Link>
                )}
                {urls?.thumbnailUrl && (
                  <Link
                    href={urls.thumbnailUrl}
                    target="_blank"
                    className="block text-blue-400 underline hover:text-blue-300 transition-colors"
                  >
                    View Thumbnail
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
