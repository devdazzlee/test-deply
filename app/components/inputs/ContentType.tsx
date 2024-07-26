'use client';

import { useCallback, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";

interface ContentTypeProps {
    title: string;
    subtitle: string;
    category: string[];
    onChange: (value: string) => void;
}

const ContentType: React.FC<ContentTypeProps> = ({
    title,
    subtitle,
    category,
    onChange
}) => {



    return (
        <div
            className="flex flex-col gap-4"
        >
            <div className="flex flex-col">
                <div className="font-medium">
                    {title}
                </div>
                <div className="font-light text-gray-600">
                    {subtitle}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-x-auto md:overflow-y-auto max-h-[50vh]">

                {categories.map((item) => (
                    <div key={item.label} className="col-span-1">
                        <CategoryInput
                            onClick={(category) => onChange(category)}
                            selected={category.includes(item.label)}
                            label={item.label}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>

        </div >
    );
}

export default ContentType;