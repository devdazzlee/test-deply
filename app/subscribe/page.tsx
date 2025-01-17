"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Button from "../components/Button";

export default function SubscribePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const subscribeAction = async (option: string) => {
    setLoading(true);

    axios
      .post("/api/stripe/subscription", { option })
      .then((response: any) => {
        const { url } = response.data;

        if (url) {
          window.location.href = url;
        } else {
          toast.success("Subscription option selected");
          router.refresh();
        }
      })
      .catch((error: any) => {
        toast.error(error?.response?.data?.error || "Something went wrong.");
        router.refresh();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div>
        <h2 className='text-3xl font-bold text-center mt-12 sm:text-5xl'>
          Pricing
        </h2>
        <p className='max-w-3xl mx-auto mt-4 text-xl text-center'>
          Your creation. Your control.
        </p>
      </div>
      <div className='flex justify-center px-8 mt-24'>
        <div className='w-full max-w-6xl flex lg:flex-row flex-col gap-8'>
          <div className='relative p-8 border border-gray-200 rounded-2xl shadow-sm flex flex-col flex-1'>
            <div className='flex-1'>
              <h3 className='text-xl font-semibold'>Basic</h3>
              <p className='mt-4 flex items-baseline'>
                <span className='text-5xl font-extrabold tracking-tight'>
                  $0
                </span>
                <span className='ml-1 text-xl font-semibold'>/year</span>
              </p>
              <p className='mt-6'>You just want to discover</p>
              <ul role='list' className='mt-6 space-y-6'>
                <li className='flex'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='flex-shrink-0 w-6 h-6 text-yellow-500'
                    aria-hidden='true'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                  <span className='ml-3'>
                    5% fees on your confirmed bookings
                  </span>
                </li>
                <li className='flex'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='flex-shrink-0 w-6 h-6 text-yellow-500'
                    aria-hidden='true'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                  <span className='ml-3'>No hidden fees</span>
                </li>
                <li className='flex'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='flex-shrink-0 w-6 h-6 text-yellow-500'
                    aria-hidden='true'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                  <span className='ml-3'>Get started away! </span>
                </li>
              </ul>
            </div>
            <div className='p-4'>
              <Button
                label='Subscribe'
                onClick={() => subscribeAction("booking_fee")}
                disabled={loading}
              />
            </div>
          </div>
          <div className='relative p-8  border border-gray-200 rounded-2xl shadow-sm flex flex-col flex-1'>
            <div className='flex-1'>
              <h3 className='text-xl font-semibold'>Pro</h3>
              <p className='absolute top-0 py-1.5 px-4 bg-yellow-500 text-white rounded-full text-xs font-semibold uppercase tracking-wide  transform -translate-y-1/2'>
                Most popular
              </p>
              <p className='mt-4 flex items-baseline'>
                <span className='text-5xl font-extrabold tracking-tight'>
                  $299
                </span>
                <span className='ml-1 text-xl font-semibold'>/year</span>
              </p>
              <p className='mt-6'>You&apos;re an established creator</p>
              <ul role='list' className='mt-6 space-y-6'>
                <li className='flex'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='flex-shrink-0 w-6 h-6 text-yellow-500'
                    aria-hidden='true'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                  <span className='ml-3'>$0 fees on ALL bookings!</span>
                </li>
                <li className='flex'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='flex-shrink-0 w-6 h-6 text-yellow-500'
                    aria-hidden='true'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                  <span className='ml-3'>No hidden fees</span>
                </li>
              </ul>
            </div>
            <div className='p-4'>
              <Button
                label='Subscribe'
                onClick={() => subscribeAction("flat_fee")}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
