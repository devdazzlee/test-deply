import React from 'react';

export default function Contact() {
    return (
        <div className="p-4 bg-white">
            <div className="max-w-4xl mx-auto rounded-lg p-2 md:p-6">

                <section className="mb-6">
                    <h3 className="text-xl md:text-2xl font-semibold mb-2">Contact Information</h3>
                    <p className="text-theme1 mb-8">
                        If you have any questions, please contact us at:
                    </p>
                    <p className="font-bold">**ShutterGuide LLC**</p>
                    <a href="mailto:shutterguidellc@gmail.com" className="text-blue-600">shutterguidellc@gmail.com</a>
                </section>


            </div>
        </div>
    );
}
