'use client';

import { SafeComment } from "@/app/types";
import React, { useState } from "react";
import RatingStars from "../RatingStars";

interface CommentProps {
    comment: SafeComment
}
const Comment: React.FC<CommentProps> = ({ comment }) => {

    const originalDate = new Date(comment.createdAt);

    // Format the date to "Month day, year" format
    const formattedDate = originalDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    return (
        <>
            <article className="p-6 text-base bg-white rounded-lg ">
                <footer className="flex flex-col gap-y-2 justify-between  mb-2 relative">
                    <div className="flex items-center">
                        <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
                            <img
                                className="mr-2 w-10 h-10 rounded-full"
                                src={comment.user.image || "https://as1.ftcdn.net/v2/jpg/07/62/37/24/1000_F_762372494_0jJCh4efbXYIAkKJmXxK2eWS8wuaVpQS.jpg"}
                                alt="Michael Gough" />{comment.user.name}</p>
                        <p className="text-sm text-gray-600 "><div >{formattedDate}</div></p>
                    </div>

                    <RatingStars rating={comment.rating} />

                </footer>
                <p className="text-gray-500">{comment.text}</p>

            </article>

        </>
    )
}

export default Comment;
