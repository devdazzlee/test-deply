import Link from 'next/link';
import React from 'react';

export default function Privacy() {
    return (
        <div className="p-4 bg-white">
            <div className="max-w-4xl mx-auto rounded-lg p-2 md:p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-center mt-12 sm:mt-6 mb-6">Privacy Policy for ShutterGuide LLC</h1>
                <p className="text-sm text-theme1 text-center mb-8">Effective Date: October 19, 2024</p>

                <section className="mb-6">
                    <p className="text-theme1">
                        ShutterGuide LLC (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit our website or use our services. By accessing or using ShutterGuide, you agree to the terms of this Privacy Policy.
                    </p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl md:text-2xl font-semibold mb-2">Information We Collect:</h3>
                    <h4 className="text-lg font-medium mb-1">
                        - Personal Information
                    </h4>
                    <p className="text-theme1">
                        When you create a profile as a &quot;Creator&quot; or book a service as a &quot;Client&quot; we may collect the following personal information:<br></br><br></br>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Location</li>
                            <li>Payment information</li>
                            <li>Social media links</li>
                            <li>Profile photos and portfolio images</li>
                            <li>Biography or personal description</li>
                        </ul>

                    </p>
                </section>

                <section className="mb-6">
                    <h4 className="text-lg font-medium mb-1">
                        - Usage Data
                    </h4>
                    <p className="text-theme1">
                        We may collect information about how you access and use our website, including:<br></br><br></br>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>IP address</li>
                            <li>Browser type</li>
                            <li>Device type</li>
                            <li>Pages visited</li>
                            <li>Time and date of visit</li>
                            <li>Referring website</li>
                        </ul>

                    </p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl md:text-2xl font-semibold mb-2">How we use your Information</h3>
                    <h4 className="text-lg font-medium mb-1">We use the information we collect for various purposes, including:</h4> <br></br>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>To facilitate bookings between Creators and Clients</li>
                        <li>To manage your profile and account</li>
                        <li>To process payments and transactions</li>
                        <li>To communicate with you regarding your bookings or inquiries</li>
                        <li>To improve our services and website functionality</li>
                        <li>To send you promotional materials, with your consent</li>
                    </ul>
                    <br></br>
                    <h4 className="text-lg font-medium mb-1">Sharing Your Information</h4>
                    <p className="text-theme1">
                        We do not sell or rent your personal information to third parties. We may share your information in the following circumstances:

                    </p>
                    <br></br>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>With Creators: When you book a Creator, we share necessary information with them to fulfill your booking.</li>
                        <li>Service Providers: We may share your information with third-party service providers who assist us in operating our website, processing payments, or providing services to you, subject to confidentiality agreements.</li>
                        <li>Legal Compliance: We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
                    </ul>

                </section>

                <section className="mb-6">
                    <h4 className="text-lg font-medium mb-1">Data Security</h4>
                    <p className="text-theme1">
                        We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or method of electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee its absolute security.
                    </p>
                    <br></br>
                    <h4 className="text-lg font-medium mb-1">Your Rights</h4>
                    <p className="text-theme1">
                        In accordance with Colorado privacy laws, you have certain rights regarding your personal information, including:<br></br><br></br>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>The right to access and obtain a copy of your personal information</li>
                            <li>The right to request correction of any inaccuracies</li>
                            <li>The right to request deletion of your personal information, subject to legal obligations</li>
                        </ul>

                    </p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl md:text-2xl font-semibold mb-2">To exercise these rights, please contact us using the information below.</h3>
                    <h4 className="text-lg font-medium mb-1">Children&apos;s Privacy</h4>
                    <p className="text-theme1">
                        Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.
                    </p>
                    <br></br>
                    <h4 className="text-lg font-medium mb-1">Changes to This Privacy Policy</h4>
                    <p className="text-theme1">
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website with a new effective date. We encourage you to review this Privacy Policy periodically for any updates.
                    </p>
                </section>







                <section className="mb-6">
                    <h3 className="text-xl md:text-2xl font-semibold mb-2">Contact Us</h3>
                    <p className="text-theme1 mb-8">
                        If you have any questions or concerns about this Privacy Policy or our practices regarding your personal information, please contact us at:
                    </p>
                    <p className="font-bold">**ShutterGuide LLC**</p>
                    <a href="mailto:shutterguidellc@gmail.com" className="text-blue-600">shutterguidellc@gmail.com</a>
                </section>

                <p className="text-theme1 text-sm">
                    Thank you for choosing ShutterGuide LLC!
                </p>
            </div>
        </div >
    );
}
