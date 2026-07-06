'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { contactService } from '@/services/contactService';

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactPage() {
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setFormMessage(null);
    try {
      await contactService.submitContactForm({
        name: data.name,
        email: data.email,
        message: data.message,
      });

      setIsSuccess(true);
      setFormMessage('Your message has been sent successfully! We typically reply within 24 hours.');
      reset();
      
      setTimeout(() => {
        setFormMessage(null);
      }, 1000);
    } catch {
      setIsSuccess(false);
      setFormMessage('Failed to send your message. Please try again later.');
      
      setTimeout(() => {
        setFormMessage(null);
      }, 3000);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=870&auto=format&fit=crop')]">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Wrapper */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
        {/* Glass Container */}
        <div className="w-full max-w-6xl rounded-2xl overflow-hidden grid md:grid-cols-2 bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
          
          {/* LEFT SIDE: Info & Branding */}
          <div className="hidden md:flex flex-col justify-between p-8 lg:p-12 text-white bg-black/20">
            <div>
              <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
                Customer Support
              </span>

              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mt-4">
                Get in Touch<br />With Us 
              </h1>

              <p className="mt-4 text-slate-200 max-w-sm text-sm">
                Have questions about your orders, shipments, or store items in Kigali? Reach out to our support team anytime.
              </p>

              {/* Contact Info Cards */}
              <div className="mt-8 space-y-4">
                {/* Location - Open in Google Maps */}
                <a
                  href="https://maps.google.com/?q=Kigali+City,+Rwanda" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">

                  <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                    <FiMapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Location</p>
                    <p className="text-sm font-medium text-white">Kigali City, Rwanda</p>
                  </div>
                </a>

                {/* Email - Open Email Client */}
                 <a
                   href="mailto:support@kigalistore.online"
                   className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                    <FiMail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Email Us</p>
                    <p className="text-sm font-medium text-white">support@kigalistore.online</p>
                  </div>
                </a>
                  {/* Phone - Open Phone Dialer */}
                <a
                  href="tel:+250780000000"
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                    <FiPhone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Call Support</p>
                    <p className="text-sm font-medium text-white">+250 780 000 000</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="mt-10">
              <Link href="/" className="text-sm text-white/80 hover:text-white transition w-fit inline-flex items-center gap-1">
                ← Back to Home
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: Contact Form */}
          <div className="flex items-center justify-center p-10 bg-white/[0.03] backdrop-blur-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
              <h2 className="text-3xl font-bold text-white mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-300 mb-6">We typically reply within 24 hours.</p>

              <div className="space-y-4">
                <div>
                  <AuthInput label="Full Name" type="text" placeholder="John Doe" glass {...register('name', { required: 'Name is required' })} />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <AuthInput label="Email" type="email" placeholder="you@example.com" glass {...register('email', { required: 'Email is required' })} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write your message here..."
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-slate-300 text-sm focus:outline-none focus:border-orange-500 transition resize-none"
                    {...register('message', { required: 'Message is required' })}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                </div>
              </div>

              {formMessage && (
                <p className={`mt-4 text-sm text-center rounded-lg px-3 py-2 transition-all duration-300 ${isSuccess ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/20 border border-red-500/30 text-red-300'}`}>
                  {formMessage}
                </p>
              )}

              <div className="mt-6">
                <AuthButton text="SEND MESSAGE" isLoading={isSubmitting} />
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}