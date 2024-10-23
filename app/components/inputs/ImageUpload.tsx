"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useEffect } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
  var cloudinary: any;
}

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string[];
  displayImages?: Boolean
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value, displayImages = true }) => {
  const handleUpload = (result: any) => {
    const newImageUrl = result.info.secure_url;
    onChange(newImageUrl);
  };
  const handleRemove = (imageUrl: string) => {
    onChange(imageUrl);
  };

  return (
    <CldUploadWidget
      onSuccess={handleUpload}
      uploadPreset='m0gdgdqb'
      options={{
        maxFiles: 30,
        multiple: true
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className={`h-full w-full relative cursor-pointer rounded-xl hover:opacity-70 transition border-dashed border-2 ${displayImages ? 'p-20' : 'p-2 md:p-4'} border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600`}
          >
            <TbPhotoPlus size={50} />

            <div className='font-semibold text-lg text-center'> Click to upload </div>
            {displayImages === true ?
              <div className='flex absolute inset-0 w-full h-full flex-wrap overflow-y-auto'>
                {value.length > 0
                  ? value.map((imageUrl, index) => (
                    <div key={index} className='relative w-1/2 h-1/2'>
                      <Image
                        alt='Uplaod'
                        fill
                        style={{ objectFit: "cover" }}
                        className='w-full z-40'
                        src={imageUrl}
                      />
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleRemove(imageUrl);
                        }}
                        className='absolute z-50 top-2 right-2 bg-theme hover:bg-hover text-white rounded-full h-6 w-6 flex items-center justify-center'
                      >
                        &times;
                      </button>
                    </div>
                  ))
                  : ""}
              </div>
              :
              <></>
            }
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
