"use client";
export const useEdgeStore = () => {
  const edgestore = {
    myPublicImages: {
      // Fetch all images
      list: async () => {
        const response = await fetch("/api/edgestore/images");
        return response.json();
      },
    },
  };
  return { edgestore };
};
