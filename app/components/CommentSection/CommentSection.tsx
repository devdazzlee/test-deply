"use client";
import axios from "axios";
import Comment from "./Comment";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import getComments from "@/app/actions/getComments";
import { SafeComment, SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";

interface CommentProps {
  listingId?: string;
  comments?: SafeComment[];
  currentUser?: SafeUser | null;
}

const CommentSection: React.FC<CommentProps> = ({
  listingId,
  comments = [],
  currentUser
}) => {
  const {
    register,
    handleSubmit,

    formState: { errors },
    reset,
    setValue
  } = useForm<FieldValues>({
    defaultValues: {
      text: "",
      rating: 3
    }
  });

  const router = useRouter();
  const onSubmit: SubmitHandler<FieldValues> = data => {
    // console.log(data, listingId);

    axios
      .post(`/api/comments/${listingId}`, data)
      .then(() => {
        toast.success("Comment posted!");
        router.refresh();
        reset();
      })
      .catch(error => {
        console.log(error);

        toast.error("Something went wrong.");
      });
  };
  const [rating, setRating] = useState(3);
  const [hoverRating, setHoverRating] = useState(3);

  const handleMouseEnter = (index: any) => {
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (index: any) => {
    setRating(index + 1);
    setValue("rating", index + 1); // Update the rating in the form data
  };
  return (
    <section className='bg-white  py-8 lg:py-16 antialiased'>
      <div className='mx-auto px-4'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-lg lg:text-2xl font-bold text-gray-900'>
            Reviews({comments.length})
          </h2>
        </div>
        {currentUser && (
          <form className='mb-6' onSubmit={handleSubmit(onSubmit)}>
            <div className='py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200'>
              <label htmlFor='comment' className='sr-only'>
                Your comment
              </label>
              <textarea
                id='comment'
                rows={6}
                className='px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none '
                placeholder='Write a review...'
                required
                {...register("text", { required: true })}
              ></textarea>
            </div>

            <div className='flex items-center mb-4'>
              {Array.from({ length: 5 }, (_, index) => (
                <button
                  type='button'
                  key={index}
                  onClick={() => handleClick(index)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  className='p-1'
                >
                  <svg
                    className={`w-4 h-4 ${index < (hoverRating || rating)
                      ? "text-[#BF9B30]"
                      : "text-hover"
                      }`}
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 22 20'
                  >
                    <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
                  </svg>
                </button>
              ))}
            </div>

            <button
              type='submit'
              className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-theme rounded-lg focus:ring-4 focus:ring-theme hover:opacity-80'
            >
              Post review
            </button>
          </form>
        )}
        {comments.map(comment => (
          <>
            <Comment comment={comment} />
            <hr />
          </>
        ))}
      </div>
    </section>
  );
};

export default CommentSection;
