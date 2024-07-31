'use client';

import React from 'react';

interface SlidingScaleProps {
    title: string;
    subtitle: string;
    value: number;
    labels: string[];
    onChange: (value: number) => void;
}

const SlidingScale: React.FC<SlidingScaleProps> = ({
    title,
    subtitle,
    value,
    labels,
    onChange
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(event.target.value));
    };
    const valueIndex = labels.indexOf(`${value}+ years`);

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
            <div className="flex flex-col items-center gap-4">
                <input
                    id="default-range"
                    type="range"
                    min={0}
                    max={labels.length - 1}
                    step={1}
                    value={valueIndex}
                    onChange={(e) => handleChange({ ...e, target: { ...e.target, value: labels[Number(e.target.value)].split('+')[0] } })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="text-center">
                    {labels[valueIndex]}
                </div>
            </div>
        </div>
    );
}

export default SlidingScale;
