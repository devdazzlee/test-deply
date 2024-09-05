"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Visa } from "react-payment-logos/dist/logo";
import { Chart, BarElement, CategoryScale, LinearScale, BarController, Title, Tooltip, Legend } from 'chart.js';
import { MouseEventHandler } from "react";


import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell
} from "@nextui-org/react";
import { Pagination } from "@nextui-org/react";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Link from "next/link";
import { SafeUser } from "../types";

interface BillingClientProps {
    currentUser?: SafeUser | null;
}

const BillingClient: React.FC<BillingClientProps> = ({ currentUser }) => {
    const [loading, setLoading] = useState(false);
    console.log(currentUser);

    const onboardAction = useCallback(() => {
        setLoading(true);

        axios
            .post("/api/stripe/onboard")
            .then((response: any) => {
                if (response.data?.url) {
                    window.location.href = response.data.url;
                } else {
                    toast.error("Onboarding failed. No URL returned.");
                }
            })
            .catch((error: any) => {
                console.error(error);
                toast.error("Failed to initiate onboarding process.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className='px-6 md:pt-0 pt-12  min-h-[50vh]'>
            {/* <div className='bg-[#101727] rounded-xl shadow-lg p-6 text-white'>
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
          <div className='ml-auto'>
            <Button
              onClick={onboardAction}
              label={loading ? "Loading..." : "Stripe Onboard"}
              outline
              disabled={loading}
            />
          </div>
        </div>
      </div> */}
            <div className="mx-auto shadow rounded-xl  p-6">
                <h2 className="text-2xl font-semibold mb-2">Billing</h2>
                <p className="text-gray-600 mb-4">
                    Find all your details regarding your payments
                </p>
                <button disabled={loading} onClick={onboardAction} className="w-40 h-10 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed bg-theme hover:bg-[#28303D] text-white font-semibold py-2 px-4 rounded">
                    {loading
                        ?
                        <div role="status">
                            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                        :
                        currentUser && currentUser.stripeOnboardingComplete ? "View Dashboard" :
                            "Stripe Onboard"}
                </button>
            </div>

            {/* <div className='mt-8'>
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
      </div> */}
            {currentUser && currentUser.stripeOnboardingComplete &&
                <>
                    <div className="w-full flex items-center">
                        <div className="container mx-auto my-16">
                            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
                                <StatisticCard heading={"Total Sales"} mainContent={"$123.912"} subContent={"1.8%"} />
                                <StatisticCard heading={"Total Sales"} mainContent={"$123.912"} subContent={"1.8%"} />
                                <StatisticCard heading={"Total Sales"} mainContent={"$123.912"} subContent={"1.8%"} />
                                <StatisticCard heading={"Total Sales"} mainContent={"$123.912"} subContent={"1.8%"} />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 md:flex-row flex-col">

                        <BarChart />
                        <RecentActivity />
                    </div>
                </>
            }
        </div>
    );
}


interface StatisticCardProps {
    heading: string;
    mainContent: string | number;
    subContent?: string | null;
}

const StatisticCard: React.FC<StatisticCardProps> = ({ heading, mainContent, subContent }) => {

    return (
        <div className="p-5 bg-white rounded-xl shadow">
            <div className="text-base text-gray-400 ">{heading}</div>
            <div className="flex items-center pt-1">
                <div className="text-2xl font-bold text-gray-900 ">{mainContent}</div>
                <span className="flex items-center px-2 py-0.5 mx-2 text-sm text-green-600 bg-theme2 rounded-full">
                    <span>{subContent}</span>
                </span>
            </div>
        </div>
    )
}


Chart.register(BarElement, CategoryScale, LinearScale, BarController, Title, Tooltip, Legend);
const BarChart: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const ctx = chartRef.current?.getContext('2d');
        if (!ctx) return;

        const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const data = {
            labels: labels,
            datasets: [
                {
                    backgroundColor: "rgba(16, 23, 39, 1)",
                    hoverBackgroundColor: "rgba(	40, 48, 61, 1)",
                    borderColor: "rgb(99, 102, 241)",
                    data: [10, 10, 15, 20, 40, 30, 45, 20, 30, 55, 35, 60,],
                    fill: true,
                },
            ],
        };


        const config = {
            type: 'bar' as const,
            data: data,
            options: {
                // maintainAspectRatio: true,

                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawTicks: false,
                        },
                    },
                    y: {
                        grid: {
                            display: false,  // Hides the grid lines on the y-axis
                            drawTicks: false,
                        },
                    },
                },
            },
        };

        const myChart = new Chart(ctx, config);

        // Cleanup the chart when the component unmounts
        return () => {
            myChart.destroy();
        };
    }, []);

    return <div className="md:w-2/3 shadow p-4 md:p-8 rounded-xl">
        <h1 className="mb-4 text-gray-400">
            Monthly Overview
        </h1>
        <canvas className="" ref={chartRef} />
    </div>
};


interface RecentItemData {
    title: string;
    by: string;
    startTime: string;
    status: "ACTIVE" | "INACTIVE" | "SUCCESS";
}
interface RecentItemProps {
}

const RecentActivity: React.FC<RecentItemProps> = ({ }) => {
    const currentTime = new Date().toLocaleString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const recents: RecentItemData[] = [
        {
            title: "iPhone X",
            by: "Bella",
            startTime: currentTime,
            status: "SUCCESS",
        },
        {
            title: "Macbook Pro 2021",
            by: "Milk",
            startTime: currentTime,
            status: "ACTIVE",
        },
        {
            title: "Surface Pro",
            by: "Yuta",
            startTime: currentTime,
            status: "INACTIVE",
        },
        {
            title: "RC WPL-C24",
            by: "Mocha",
            startTime: currentTime,
            status: "ACTIVE",
        },
    ];

    const [active, setActive] = useState<number>(0);

    return (
        <div className="md:w-1/3 rounded-xl shadow flex flex-col bg-white">
            <nav className="px-5 py-4 border-b">
                <ul className="flex space-x-1 lg:space-x-2 overflow-clip">
                    <RecentTab
                        title="Today"
                        active={active === 0}
                        onClick={() => setActive(0)}
                    />
                    <RecentTab
                        title="Last Week"
                        active={active === 1}
                        onClick={() => setActive(1)}
                    />
                    <RecentTab
                        title="This Month"
                        active={active === 2}
                        onClick={() => setActive(2)}
                    />
                </ul>
            </nav>
            <ul className="flex flex-col overflow-y-auto divide-y">
                {recents.map((d, i) => (
                    <RecentItem
                        key={i}
                        title={d.title}
                        by={d.by}
                        startTime={d.startTime}
                        status={d.status}
                    />
                ))}
            </ul>

        </div>
    );

    interface RecentTabProps {
        title: string;
        active: boolean;
        onClick: MouseEventHandler<HTMLButtonElement>;
    }

    function RecentTab({ title, active, onClick }: RecentTabProps) {
        let itemClass = " text-gray-500";

        if (active) {
            itemClass = " bg-indigo-100 text-indigo-700";
        }

        return (
            <li className={"font-secondry px-4 py-2 rounded-md truncate" + itemClass}>
                <button onClick={onClick} className="focus:outline-none">
                    {title}
                </button>
            </li>
        );
    }

    interface RecentItemProps {
        title: string;
        by: string;
        startTime: string;
        status: "ACTIVE" | "INACTIVE" | "SUCCESS";
    }

    function RecentItem({ title, by, startTime, status }: RecentItemProps) {
        let statusClass = "px-2 py-1 rounded text-xs font-medium";

        switch (status) {
            case "ACTIVE":
                statusClass += " bg-theme2 text-gray-700";
                break;
            case "INACTIVE":
                statusClass += " bg-red-100 text-red-700";
                break;
            case "SUCCESS":
                statusClass += " bg-green-100 text-green-700";
                break;
        }

        return (
            <li className="flex font-secondry flex-col">
                <Link href="#" className="px-5 py-3 hover:bg-gray-100">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                            <span className="font-medium truncate">{title}</span>
                            <span className="text-xs text-gray-500">{startTime}</span>
                        </div>
                        <span className={statusClass}>{status}</span>
                    </div>
                    <div className="flex space-x-1 mt-1 text-sm">
                        <span className="text-gray-500">by</span>
                        <span className="text-gray-800">{by}</span>
                    </div>
                </Link>
            </li>
        );
    }

}

export default BillingClient

