"use client";

import Link from "next/link";


export default function FaqPage() {
    return (
        <>
            <section className="sm:pt-4 pt-16">
                <div className="flex flex-col justify-center p-4 mx-auto md:p-8">
                    <h2 className="mb-12 text-4xl font-bold leading text-center sm:text-5xl">Frequently Asked Questions</h2>
                    <div className="flex flex-col divide-y sm:px-8 lg:px-12 xl:px-32 divide-gray-700">
                        <details>
                            <summary className="py-2 outline-none cursor-pointer focus:underline">How do I create a profile on ShutterGuide?</summary>
                            <div className="px-4 pb-4">
                                <p>To create a profile, simply click on the &quot;Signup&quot; button on our homepage. You&apos;ll need to provide an email address and set a password. After that, follow the prompts to select your categories, complete the Stripe onboarding process, and fill out the required questions to complete your profile.</p>
                            </div>
                        </details>
                        <details>
                            <summary className="py-2 outline-none cursor-pointer focus:underline">Is there a cost to create a profile?</summary>
                            <div className="px-4 pb-4">
                                <p>Creating a profile on ShutterGuide is free. However, as a Creator, you will be charged either 5% of your total booking fees or an annual fee of $299, depending on which option you choose.</p>
                            </div>
                        </details>
                        <details>
                            <summary className="py-2 outline-none cursor-pointer focus:underline">What are the fees for booking a Creator?</summary>
                            <div className="px-4 pb-4">
                                <p>If you are a public user looking to book a Creator, there is a fee of 3% of the total booking amount.</p>
                            </div>
                        </details>
                        <details>
                            <summary className="py-2 outline-none cursor-pointer focus:underline">How does the payment process work for Creators?</summary>
                            <div className="px-4 pb-4">
                                <p>Creators will receive payments directly through their Stripe accounts after a booking is completed. Ensure your Stripe onboarding is complete for timely payments.</p>
                            </div>
                        </details>
                        <details>
                            <summary className="py-2 outline-none cursor-pointer focus:underline">Can I change my pricing after creating my profile?</summary>
                            <div className="px-4 pb-4">
                                <p>Yes, you can update your pricing and other profile details at any time. Just log in to your account and navigate to your profile settings to make changes.</p>
                            </div>
                        </details>
                        <details>
                            <summary className="py-2 outline-none cursor-pointer focus:underline">What types of media can I upload to my profile?</summary>
                            <div className="px-4 pb-4">
                                <p>You can upload photography and videography work that you have created or have the rights to use. Make sure that all uploaded content complies with our <span>
                                    <Link href={'terms-and-conditions'} className="text-theme underline">
                                        Terms and Conditions.
                                    </Link>
                                </span>
                                </p>
                            </div>
                        </details>
                        <details>
                            <summary className="py-2 outline-none cursor-pointer focus:underline">How will I be charged if I choose the 5% booking fee option?</summary>
                            <div className="px-4 pb-4">
                                <p>If you choose the 5% option, this fee will be automatically deducted from each booking payment you receive. You will see this deduction reflected in your Stripe account.</p>
                            </div>
                        </details>
                        <details>
                            <summary className="py-2 outline-none cursor-pointer focus:underline">What happens if I do not complete the Stripe onboarding process?</summary>
                            <div className="px-4 pb-4">
                                <p>If you do not complete the Stripe onboarding process, you will not be able to receive payments for your bookings. It is essential to finish this step to ensure your account is fully functional.</p>
                            </div>
                        </details>
                        <details>
                            <summary className="py-2 outline-none cursor-pointer focus:underline">How do I promote my profile to get more bookings?</summary>
                            <div className="px-4 pb-4">
                                <p>Promote your ShutterGuide profile through social media, your personal website, and other marketing channels. Sharing your unique profile link with potential clients can also help drive traffic.</p>
                            </div>
                        </details>
                        <details>
                            <summary className="py-2 outline-none cursor-pointer focus:underline">What support does ShutterGuide offer if I have issues?</summary>
                            <div className="px-4 pb-4">
                                <p>If you encounter any issues or have questions, you can reach out to our support team via email at <span> <a
                                    href="mailto:shutterguidellc@gmail.com"
                                    className="text-theme1 font-semibold underline hover:text-black">
                                    shutterguidellc@gmail.com
                                </a>. </span> We’re here to help and will respond as quickly as possible.</p>
                            </div>
                        </details>
                    </div>
                    <div className="py-4 px-1 sm:p-4 lg:p-8">

                        <h1>For further inquiries, feel free to contact us! Thank you for choosing ShutterGuide LLC to showcase your creative work.</h1>
                    </div>
                </div>
            </section>

        </>
    );
}

