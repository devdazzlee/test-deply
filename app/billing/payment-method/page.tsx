"use client";

import { IconCheck, IconX } from "@tabler/icons-react";
import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import Link from 'next/link';

export default function PaymentMethod() {
  return (
    <div className='p-10 pt-0'>
      <div className='max-w-lg mx-auto space-y-4'>
        <h3 className='font-semibold text-xl'>Payment Method</h3>

        <Input
          variant='bordered'
          label='Card Holder'
          isRequired
          radius='sm'
          placeholder='Enter the name written on the card'
        />
        <Input
          variant='bordered'
          label='Card Number'
          isRequired
          radius='sm'
          placeholder='Enter card number'
        />
        <div className='flex gap-4'>
          <Input
            variant='bordered'
            label='Expiry'
            isRequired
            radius='sm'
            placeholder='Enter expiry date of card'
            className='flex-[2]'
          />
          <Input
            variant='bordered'
            label='CVV'
            isRequired
            radius='sm'
            placeholder='000'
            className='flex-[1]'
          />
        </div>

        <div className='flex gap-2'>
          <Link href="/billing">
            <Button
              color='success'
              variant='solid'
              startContent={<IconCheck size={16} />}
              radius='sm'
              className='!font-bold'
            >
              Save
            </Button>
          </Link>
          <Link href="/billing">
            <Button
              color='default'
              variant='flat'
              startContent={<IconX size={16} />}
              radius='sm'
              className='!font-bold'
            >
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
