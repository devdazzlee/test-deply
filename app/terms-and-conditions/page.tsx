"use client";


export default function TermsAndConditionsPage() {
    return (
        <>
            <div className="bg-white text-black sm:pt-0 pt-8 p-4">
                <div className="container mx-auto px-4 pt-8">

                    <div className='w-full flex'>
                        <h1 className="text-3xl font-bold mb-4 text-theme">Terms of Service for Your Business </h1>
                    </div>
                    <br />
                    <p className="mb-4 text-base">
                        Welcome to the website. Please read these terms of service carefully before using the website. By using the website, you agree to be bound by these terms of service. If you do not agree to these terms of service, you may not use the website. These terms of service govern your use of the website and all services provided by the website. If you do not agree to these terms of service, you may not use the website.
                    </p>
                    <br />
                    <div className=''>
                        <h2 className='font-bold text-theme'>General</h2>

                        <br />
                        <ul className="px-8">
                            <li className='list-disc'>
                                <p className="text-base">
                                    By accessing this website, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
                                </p>
                            </li>
                            <br />
                            <li className='list-disc'>
                                <p className="text-base">
                                    We reserve the right to change these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service. Any updates you will be notified via email.
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

