"use client";

import { Visa } from "react-payment-logos/dist/logo";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@nextui-org/react";
import { Pagination } from "@nextui-org/react";

export default function BillingPage() {
  return (
    <div className='p-10 pt-0'>
      <div className='bg-[#101727] rounded-xl shadow-xl p-6 text-white'>
        <h3 className='font-semibold text-xl'>Payment Method</h3>
        <div className='bg-[#28303D] rounded p-4 mt-4 font-semibold flex items-center'>
          <div className='self-start mr-4 bg-white rounded p-0.5'>
            <Visa width={38} height='auto' />
          </div>
          <div>
            <p>
              Visa
              <pre className='inline ml-2'>
                <code>**** **** **** 3354</code>
              </pre>
            </p>
            <p className='text-[#cacaca] text-sm mt-0'>Alfred Nobel</p>
            <p className='text-[#adadad] text-sm mt-1'>
              Expires on 16 Feb 2027
            </p>
          </div>
          <div className='ml-auto dark text-foreground font-bold'>
            <Link href='/billing/payment-method'>
              <Button
                color='secondary'
                variant='solid'
                startContent={<IconEdit size={16} />}
                radius='sm'
                className='!font-bold'
              >
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <h3 className='font-semibold text-xl'>Billing History</h3>

        <Table className='mt-4'>
          <TableHeader>
            <TableColumn>AMOUNT</TableColumn>
            <TableColumn>DATE</TableColumn>
            <TableColumn>STATUS</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>
            <TableRow>
              <TableCell>$320</TableCell>
              <TableCell>25 Mar 2024</TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>$320</TableCell>
              <TableCell>25 Mar 2024</TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>$320</TableCell>
              <TableCell>25 Mar 2024</TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>$320</TableCell>
              <TableCell>25 Mar 2024</TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>$320</TableCell>
              <TableCell>25 Mar 2024</TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Pagination total={10} initialPage={1} className='mt-3' />
        <p className='text-gray-500 mt-2 text-sm'>Showing 10 of 10 rows</p>
      </div>
    </div>
  );
}
