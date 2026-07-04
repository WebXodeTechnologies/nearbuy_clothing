"use client";

import React, { useState } from "react";
import Breadcrumb from "../../components/navigation/Breadcrumb";
import Card, { CardBody } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback("");

    setTimeout(() => {
      setIsLoading(false);
      setFeedback("Thank you! Your message has been sent successfully. We will get back to you shortly.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1000);
  };

  return (
    <div className="flex-1 bg-gray-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Contact Us", href: "/contact" }]} />

        {/* Page Header */}
        <div className="mt-6 mb-10">
          <h1 className="text-2xl font-bold text-gray-950 tracking-tight sm:text-3xl">
            Get in Touch
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Have questions about store listings, merchant subscriptions, or partnerships? Write to us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <Card className="bg-white">
              <CardBody className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Send us a Message</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">We typically respond to enquiries within 24 hours.</p>
                </div>

                {feedback && (
                  <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg">
                    {feedback}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      name="name"
                      placeholder="John Doe"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <Input
                    label="Subject"
                    name="subject"
                    placeholder="Inquiry about vendor registration, listing issues..."
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />

                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Message / Comments</label>
                    <textarea
                      rows={5}
                      placeholder="Explain your queries or support request in detail..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full text-sm block border border-gray-250 rounded-lg p-2.5 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto px-6">
                      Send Enquiry
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Directory Contact Info Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Info block */}
            <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-xs space-y-5">
              <h3 className="font-bold text-gray-900 text-sm border-b border-gray-50 pb-2.5">Corporate Office</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 text-xs text-gray-600 leading-normal">
                  <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block">HQ Address</span>
                    <span>Nearby Clothing Platforms Pvt Ltd, 45, 100 Feet Rd, Hal 2nd Stage, Indiranagar, Bengaluru, KA 560038</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-xs text-gray-600">
                  <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block">Support Desk</span>
                    <span>support@nearbyclothing.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-xs text-gray-600">
                  <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block">Merchant Hotline</span>
                    <span>+91 90000 80000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Frame Card */}
            <div className="bg-white border border-gray-150 p-2.5 rounded-2xl shadow-xs overflow-hidden h-64 bg-gray-50">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.973412708453!2d77.63851571482204!3d12.971891590855848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a629633e89%3A0xb697fa297593c6f2!2sIndiranagar!5e0!3m2!1sen!2sin!4v1625480000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '0.75rem' }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
