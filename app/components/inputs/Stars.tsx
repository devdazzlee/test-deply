'use client';

import React from 'react';

interface StarsProps {
    title: string;
    subtitle: string;
    value: number;
    onChange: (value: number) => void;
}

const Stars: React.FC<StarsProps> = ({ title, subtitle, value, onChange }) => {
    const handleClick = (starValue: number) => {
        if (starValue < 3) {
            onChange(3);
        } else {
            onChange(starValue);
        }
    };

    return (
        <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
                <div className="font-medium">
                    {title}
                </div>
                <div className="font-light text-gray-600">
                    {subtitle}
                </div>
            </div>
            <div className="flex flex-row items-center gap-2">
                {Array.from({ length: 5 }, (_, index) => (
                    <span
                        key={index}

                        onClick={() => handleClick(index + 1)}
                    >
                        <svg className={`w-4 h-4 cursor-pointer text-2xl ${index < value ? 'text-rose-500' : 'text-gray-300'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                    </span>
                ))}
            </div>
        </div>
    );
}

export default Stars;
