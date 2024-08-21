'use client';

import Button from "../components/Button";

export default function SubscribePage() {
  return (
    <div className="">
      <div>
        <h2 className="text-3xl font-bold tracki text-center mt-12 sm:text-5xl ">
          Pricing
        </h2>
        <p className="max-w-3xl mx-auto mt-4 text-xl text-center ">
          Your creation. Your control.
        </p>
      </div>
      <div className="flex justify-center">
      <div className="mt-24 container space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8">
        <div className="relative p-8  border border-gray-200 rounded-2xl shadow-sm flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-semibold ">Basic</h3>
            <p className="mt-4 flex items-baseline ">
              <span className="text-5xl font-extrabold tracking-tight">$0</span>
              <span className="ml-1 text-xl font-semibold">/year</span>
            </p>
            <p className="mt-6 ">You just want to discover</p>
            <ul role="list" className="mt-6 space-y-6">
              <li className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 w-6 h-6 text-yellow-500"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="ml-3 ">5% fees on your confirmed bookings</span>
              </li>
              <li className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 w-6 h-6 text-yellow-500"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="ml-3 ">No hidden fees</span>
              </li>
              <li className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 w-6 h-6 text-yellow-500"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="ml-3 ">Get started away! </span>
              </li>
            </ul>
          </div>
          <div className="p-4">
            <Button label='Subscribe'/>
          </div>
        </div>
        <div className="relative p-8  border border-gray-200 rounded-2xl shadow-sm flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-semibold ">Pro</h3>
            <p className="absolute top-0 py-1.5 px-4 bg-yellow-500 text-white rounded-full text-xs font-semibold uppercase tracking-wide  transform -translate-y-1/2">
              Most popular
            </p>
            <p className="mt-4 flex items-baseline ">
              <span className="text-5xl font-extrabold tracking-tight">$290</span>
              <span className="ml-1 text-xl font-semibold">/year</span>
            </p>
            <p className="mt-6 ">You're an established creator</p>
            <ul role="list" className="mt-6 space-y-6">
              <li className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 w-6 h-6 text-yellow-500"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="ml-3 ">$0 fees on ALL bookings!</span>
              </li>
              <li className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 w-6 h-6 text-yellow-500"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="ml-3 ">No hidden fees</span>
              </li>
            </ul>
          </div>
          <div className="p-4">
            <Button label='Subscribe'/>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}


