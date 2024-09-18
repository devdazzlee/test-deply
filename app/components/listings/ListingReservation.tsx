"use client";

import { Range } from "react-date-range";
import Calendar from "../inputs/Calendar";
import Button from "../Button";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface ListingReservationProps {
  price: number;
  dateRange: Range;
  totalPrice: number;
  onChangeDate: (value: Range) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates: Date[];
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates
}) => {
  const [user, setUser] = useState<any>(false);

  return (
    <div className='bg-white rounded-xl border-[1px]border-neutral-200 overflow-hidden'>
      <div className='flex flex-row items-center gap-1 p-4'>
        <div className='text-2xl font-semibold'>$ {price}</div>
        <div className='font-light text-neutral-600'>day</div>
      </div>
      <hr />
      <Calendar
        months={1}
        value={dateRange}
        disabledDates={disabledDates}
        onChange={value => onChangeDate(value.selection)}
      />
      <hr />
      <div className='p-4'>
        <Button disabled={disabled} label='Reserve' onClick={onSubmit} />
        <div className='mt-2'>
          {/* <Button disabled={disabled} label='Chat Now' onClick={onSubmit} /> */}
          <div className='opacity-50'>
            <Button disabled={disabled} label='Login To Chat' />
          </div>
        </div>
      </div>

      <div className='p-4 flex flex-row items-center justify-between font-semibold text-lg'>
        <div>Total</div>
        <div>$ {totalPrice}</div>
      </div>
    </div>
  );
};

export default ListingReservation;
