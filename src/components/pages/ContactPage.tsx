import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Mail, Sparkles, Send, CheckCircle2, MessageCircle, Instagram, ExternalLink } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'VIP Private Atelier Appointment',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    showToast('Inquiry Received', 'Our boutique concierge will contact you shortly.', 'gold');
  };

  return (
    <div className="bg-[#F8F5F2] min-h-screen py-6 sm:py-16">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2.5">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#C6A56B]">
            Client Relations
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-[#1D1D1D]">
            VIP Concierge
          </h1>
          <p className="text-[11px] sm:text-sm text-neutral-500 font-light leading-relaxed max-w-lg mx-auto">
            Whether inquiring about bespoke creations, appointments, or personal styling, our concierge is dedicated to your service.
          </p>
        </div>

        {/* Quick Contact Buttons Row */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-2.5 sm:mb-3.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400">
              Direct Contact Channels
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {/* WhatsApp */}
            <a
              id="contact-page-whatsapp"
              href="https://wa.me/919517220111?text=Hello%20Strawbelle%20Concierge%2C%20I%20would%20like%20to%20inquire%20about%20your%20luxury%20handbags."
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col sm:flex-row items-center justify-center sm:justify-between p-2.5 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-neutral-200 hover:border-[#25D366] hover:shadow-md transition-all group text-center sm:text-left"
            >
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[11px] sm:text-xs text-[#1D1D1D] group-hover:text-[#25D366] transition-colors leading-tight">
                    WhatsApp
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-neutral-500 font-medium hidden sm:block">+91 95172 20111</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#25D366] transition-colors hidden sm:block" />
            </a>

            {/* Instagram */}
            <a
              id="contact-page-instagram"
              href="https://www.instagram.com/strawbelle_bags?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col sm:flex-row items-center justify-center sm:justify-between p-2.5 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-neutral-200 hover:border-[#E1306C] hover:shadow-md transition-all group text-center sm:text-left"
            >
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[11px] sm:text-xs text-[#1D1D1D] group-hover:text-[#E1306C] transition-colors leading-tight">
                    Instagram
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-neutral-500 font-medium hidden sm:block">@strawbelle_bags</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#E1306C] transition-colors hidden sm:block" />
            </a>

            {/* Email */}
            <a
              id="contact-page-email"
              href="mailto:concierge@strawbelle.com?subject=Strawbelle%20Concierge%20Inquiry&body=Hello%20Strawbelle%20Concierge%2C%0A%0AInstagram%3A%20https%3A%2F%2Fwww.instagram.com%2Fstrawbelle_bags%20(%40strawbelle_bags)%0A%0AInquiry%20Details%3A%0A"
              className="flex flex-col sm:flex-row items-center justify-center sm:justify-between p-2.5 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-neutral-200 hover:border-[#C6A56B] hover:shadow-md transition-all group text-center sm:text-left"
            >
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#C6A56B]/10 text-[#C6A56B] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[11px] sm:text-xs text-[#1D1D1D] group-hover:text-[#C6A56B] transition-colors leading-tight">
                    Email
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-neutral-500 font-medium hidden sm:block">concierge@strawbelle.com</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#C6A56B] transition-colors hidden sm:block" />
            </a>
          </div>
        </div>

        {/* Centered Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-4 sm:p-10 rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-sm sm:shadow-md">
            {isSubmitted ? (
              <div className="py-8 sm:py-12 text-center space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#1D1D1D] text-[#C6A56B] flex items-center justify-center mx-auto border border-[#C6A56B]">
                  <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1D1D1D]">Inquiry Dispatched</h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, {formData.name}. A dedicated Strawbelle client advisor has been assigned to your message.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <a
                    href="https://www.instagram.com/strawbelle_bags?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E1306C]/10 hover:bg-[#E1306C]/20 text-[#E1306C] text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Connect on Instagram (@strawbelle_bags)</span>
                  </a>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-2 sm:px-6 sm:py-2 bg-[#1D1D1D] text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider rounded-lg sm:rounded-xl hover:bg-[#C6A56B] transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 text-xs">
                <div className="flex items-center gap-2 pb-2.5 border-b border-neutral-100">
                  <Sparkles className="w-3.5 h-3.5 text-[#C6A56B]" />
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#1D1D1D]">
                    Private Concierge Message
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1 text-[11px] sm:text-xs">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Charlotte De La Tour"
                      className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 bg-[#F8F5F2] border border-neutral-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#C6A56B] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1 text-[11px] sm:text-xs">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="charlotte@paris.fr"
                      className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 bg-[#F8F5F2] border border-neutral-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#C6A56B] text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1 text-[11px] sm:text-xs">Telephone / WhatsApp</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+33 6 12 34 56 78"
                      className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 bg-[#F8F5F2] border border-neutral-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#C6A56B] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1 text-[11px] sm:text-xs">Inquiry Purpose</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 bg-[#F8F5F2] border border-neutral-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#C6A56B] text-xs"
                    >
                      <option value="VIP Private Atelier Appointment">Private Atelier Appointment</option>
                      <option value="Bespoke Leather Inquiry">Bespoke Leather Inquiry</option>
                      <option value="Order & Tracking Inquiries">Order & Tracking Inquiries</option>
                      <option value="Atelier Restoration & Spa Care">Atelier Restoration & Spa Care</option>
                      <option value="Press & Media Relations">Press & Media Relations</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1 text-[11px] sm:text-xs">Your Message</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please specify any preferred leather hues, appointment dates..."
                    className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 bg-[#F8F5F2] border border-neutral-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#C6A56B] text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3.5 bg-[#1D1D1D] hover:bg-[#C6A56B] text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] rounded-lg sm:rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Inquiry to Concierge</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
