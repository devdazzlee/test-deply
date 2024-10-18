"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { TbPhotoPlus } from "react-icons/tb";
import { useState } from "react";

declare global {
    var cloudinary: any;
}

interface ImageUploadProps {
    onChange: (value: string[]) => void;
    value: string[];
    listingId: string; // Add the listingId as a prop
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value, listingId }) => {
    const handleUpload = (result: any) => {
        const newImageUrl = result.info.secure_url;
        onChange([...value, newImageUrl]); // Append new image to the list
    };

    const handleRemove = (imageUrl: string) => {
        onChange(value.filter((img) => img !== imageUrl)); // Remove image from the list
    };

    const handleRearrange = (newOrder: string[]) => {
        onChange(newOrder); // Update image array order
    };

    const handleSaveImages = async () => {
        try {
            const response = await fetch(/api/listings / ${ listingId } / images, {
                method: 'PATCH',
                body: JSON.stringify({
                    imageSrc: value // The updated array of image URLs
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update images');
            }

            const updatedListing = await response.json();
            console.log('Images updated successfully:', updatedListing);
        } catch (error) {
            console.error('Error updating images:', error);
        }
    };

    return (
        <>
            <CldUploadWidget
                onSuccess={handleUpload}
                uploadPreset="m0gdgdqb"
                options={{
                    maxFiles: 4,
                    multiple: true
                }}
            >
                {({ open }) => {
                    return (
                        <div
                            onClick={() => open?.()}
                            className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
                        >
                            <TbPhotoPlus size={50} />
                            <div className="font-semibold text-lg">Click to upload</div>
                            {/* Display uploaded images */}
                            <div className="flex absolute inset-0 w-full h-full flex-wrap">
                                {value.length > 0
                                    ? value.map((imageUrl, index) => (
                                        <div key={index} className="relative w-1/2 h-1/2">
                                            <Image
                                                alt="Upload"
                                                fill
                                                style={{ objectFit: "cover" }}
                                                className="w-full z-40"
                                                src={imageUrl}
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemove(imageUrl); // Remove image on click
                                                }}
                                                className="absolute z-50 top-2 right-2 bg-theme hover:bg-hover text-white rounded-full h-6 w-6 flex items-center justify-center"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))
                                    : ""}
                            </div>
                        </div>
                    );
                }}
            </CldUploadWidget>

            <button
                onClick={handleSaveImages}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
                Save Images
            </button>
        </>
    );
};

export default ImageUpload;