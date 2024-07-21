'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from "next/image";

interface ListingImagesProps {
    imageSrc: string[],
}
const ListingImages: React.FC<ListingImagesProps> = ({
    imageSrc,

}) => {
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    if (showAllPhotos)
        return (
            <Gallery imageSrc={imageSrc} setShowAllPhotos={setShowAllPhotos} showAllPhotos={showAllPhotos} />
        );

    // if (imageSrc.length === 1) {

    //     return (
    //         <div className='relative'>


    //             <div className="flex overflow-hidden rounded-[12px]">
    //                 {imageSrc[0] && (
    //                     <div className="h-[60vh] w-full">
    //                         <Image
    //                             // onClick={() => setShowAllPhotos(true)}
    //                             className="cursor-pointer object-cover cursor-pointer rounded-lg"
    //                             src={imageSrc[0]}
    //                             alt="image" fill
    //                         />
    //                     </div>
    //                 )}
    //             </div>
    //         </div>
    //     )
    // }
    return (
        <div className="relative">
            {/* Medium devices */}

            <div className="hidden h-[400px] max-h-[450px] grid-cols-4 gap-2 overflow-hidden rounded-[12px] md:grid">
                {/* column 1 */}
                <div className="col-span-2 overflow-hidden">
                    {imageSrc[0] && (
                        <div className="h-full relative overflow-hidden bg-red-200 rounded-l-lg">
                            <Image
                                // onClick={() => setShowAllPhotos(true)}
                                className="cursor-pointer object-cover cursor-pointer rounded-l-lg relative"
                                src={imageSrc[0]}
                                alt="image" fill
                            />
                        </div>
                    )}
                </div>
                {/* column 2 */}
                <div className="col-span-1 overflow-hidden">
                    {/* row grid inside column 2 */}
                    <div className="grid h-full grid-rows-2 gap-2">
                        {imageSrc[1] && (
                            // row 1
                            <div className="bg-gray-200 relative">
                                <Image
                                    // onClick={() => setShowAllPhotos(true)}
                                    className="cursor-pointer object-cover cursor-pointer "
                                    src={imageSrc[1]}
                                    alt="image" fill
                                />
                            </div>
                        )}

                        {imageSrc[2] && (
                            // row 2
                            <div className="bg-gray-200 relative">
                                <Image
                                    // onClick={() => setShowAllPhotos(true)}
                                    className="cursor-pointer object-cover cursor-pointer rounded-tr-lg"
                                    src={imageSrc[2]}
                                    alt="image" fill
                                />
                            </div>
                        )}
                    </div>
                </div>
                {/* column 3 */}
                <div className="col-span-1 overflow-hidden">
                    {/* row grid inside column 3 */}
                    <div className="grid h-full grid-rows-2 gap-2">
                        {imageSrc[3] && (
                            // row 1
                            <div className="h-full bg-gray-200 relative">
                                <Image
                                    // onClick={() => setShowAllPhotos(true)}
                                    className="cursor-pointer object-cover cursor-pointer "
                                    src={imageSrc[3]}
                                    alt="image" fill
                                />
                            </div>
                        )}

                        {imageSrc[3] && (
                            // row 2
                            <div className="h-full bg-gray-200 relative">
                                <Image
                                    // onClick={() => setShowAllPhotos(true)}
                                    className="cursor-pointer object-cover cursor-pointer rounded-br-lg relative"
                                    src={imageSrc[3]}
                                    alt="image" fill
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile devices */}
            <div className="flex overflow-hidden rounded-[12px] md:hidden">
                {imageSrc[0] && (
                    <div className="h-[60vh] w-full">
                        <Image
                            // onClick={() => setShowAllPhotos(true)}
                            className="cursor-pointer object-cover cursor-pointer rounded-lg"
                            src={imageSrc[0]}
                            alt="image" fill
                        />
                    </div>
                )}
            </div>

            <button
                className="absolute bottom-2 right-2 flex gap-1 rounded-xl bg-white py-2 px-4 shadow-md shadow-gray-500 "
                onClick={() => setShowAllPhotos(true)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6"
                >
                    <path
                        fillRule="evenodd"
                        d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                        clipRule="evenodd"
                    />
                </svg>
                Show all photos
            </button>
        </div>
    );
};



interface Gallery {
    imageSrc: string[],
    showAllPhotos: boolean,
    setShowAllPhotos: (value: boolean) => void
}

const Gallery: React.FC<Gallery> = ({ imageSrc, setShowAllPhotos, showAllPhotos }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (showAllPhotos !== null) {
            // Disable scrolling on the parent when an image is selected
            document.body.style.overflow = 'hidden';
        } else {
            // Enable scrolling on the parent when no image is selected
            document.body.style.overflow = 'auto';
        }
        // Clean up to ensure overflow is reset if the component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showAllPhotos]);
    const handleImageClick = (index: any) => {
        if (imageRefs.current[index]) {
            imageRefs.current[index].scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <>
            <div className="fixed w-full flex justify-center h-full inset-0 z-20 overflow-auto bg-white text-white">
                <div className="relative gap-y-8 w-full grid gap-4 bg-white px-2 py-4 md:p-8">
                    <div className='flex justify-end'>
                        <button
                            className="flex gap-1 rounded-2xl bg-white py-2 px-4 text-black shadow-sm shadow-gray-500"
                            onClick={() => setShowAllPhotos(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Close photos
                        </button>
                    </div>
                    <div className="hidden md:flex flex-row h-full w-full flex-wrap gap-4 px-4">
                        {imageSrc.map((img, index) => (
                            <div
                                key={index}
                                className='cursor-pointer relative w-24 h-24 transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg'
                                onClick={() => handleImageClick(index)}
                            >
                                <Image src={img} className='object-cover cursor-pointer rounded-lg' alt='image' fill />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:mt-8 gap-6 px-8 items-center justify-center py-4">
                        <Grid imageSrc={imageSrc} setSelectedImage={setSelectedImage} />
                        {imageSrc.length > 0 &&
                            imageSrc.map((photo, index) => (
                                <div
                                    key={index}
                                    className="w-full h-[80vw] md:w-[60vw] relative md:h-[45vw]"
                                    ref={el => {
                                        imageRefs.current[index] = el;
                                    }}
                                >
                                    <Image
                                        src={photo}
                                        alt="image"
                                        fill
                                        className="object-cover cursor-pointer rounded-lg"
                                        onClick={() => setSelectedImage(photo)}
                                    />
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {selectedImage && (
                <div className="fixed inset-0 z-40 flex justify-center items-center bg-black w-full h-full p-8">
                    <button
                        className="absolute z-50 top-4 right-4 text-white bg-gray-700 rounded-full p-2"
                        onClick={() => setSelectedImage(null)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <div className="relative w-full h-full">
                        <Image src={selectedImage} alt="Selected" fill className="object-contain" />
                    </div>
                </div>
            )}
        </>
    );
};
interface Grid {
    imageSrc: string[],
    setSelectedImage: (value: string) => void
}

const Grid: React.FC<Grid> = ({ imageSrc, setSelectedImage }) => {
    return (
        <>
            <div className="flex flex-col items-center gap-4 w-full">
                <div className="w-full h-[80vw] md:w-[60vw] relative md:h-[45vw]">
                    <Image src={imageSrc[0]} alt="image" fill className="object-cover cursor-pointer rounded-lg" onClick={() => setSelectedImage(imageSrc[0])} />
                </div>
                <div className="grid grid-cols-2 gap-4 w-full md:w-[60vw]">
                    <div className="w-full h-[40vw] relative md:h-[20vw]">
                        <Image src={imageSrc[1]} alt="image" fill className="object-cover cursor-pointer rounded-lg" onClick={() => setSelectedImage(imageSrc[1])} />
                    </div>
                    <div className="w-full h-[40vw] relative md:h-[20vw]">
                        <Image src={imageSrc[2]} alt="image" fill className="object-cover cursor-pointer rounded-lg" onClick={() => setSelectedImage(imageSrc[2])} />
                    </div>


                </div>
            </div>
        </>
    )

}
export default ListingImages;