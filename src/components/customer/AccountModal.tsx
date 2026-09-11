import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  User,
  X,
  MapPin,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Phone,
  Mail,
  Shield,
  Crown
} from 'lucide-react';
import { Address } from '../../types';

export const AccountModal: React.FC = () => {
  const {
    isAccountOpen,
    setIsAccountOpen,
    activeCustomer,
    customers,
    updateCustomer,
    addCustomerAddress,
    deleteCustomerAddress,
    showToast,
    setActiveView
  } = useStore();

  const [activeTab, setActiveTab] = useState<'details' | 'addresses'>('details');

  // Address modal/form state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United Kingdom',
  });

  // Profile details state
  const [detailsForm, setDetailsForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const currentCustomer = activeCustomer || customers[0];

  useEffect(() => {
    if (currentCustomer) {
      setDetailsForm({
        name: currentCustomer.name || '',
        email: currentCustomer.email || '',
        phone: currentCustomer.phone || '',
      });
    }
  }, [currentCustomer]);

  if (!isAccountOpen || !currentCustomer) return null;

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailsForm.name.trim() || !detailsForm.email.trim()) {
      showToast('Required Fields', 'Please provide your full name and email.', 'error');
      return;
    }
    updateCustomer(currentCustomer.id, {
      name: detailsForm.name,
      email: detailsForm.email,
      phone: detailsForm.phone,
    });
    showToast('Profile Updated', 'Your contact details have been successfully saved.', 'gold');
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.street || !newAddress.city) {
      showToast('Incomplete Address', 'Please complete all required fields.', 'error');
      return;
    }
    addCustomerAddress(currentCustomer.id, newAddress);
    setIsAddingAddress(false);
    showToast('Address Saved', 'New delivery destination added to your profile.', 'gold');
    setNewAddress({
      fullName: currentCustomer.name,
      email: currentCustomer.email,
      phone: currentCustomer.phone,
      street: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United Kingdom',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200 overflow-y-auto no-scrollbar">
      <div className="bg-[#F8F5F2] rounded-2xl w-full max-w-2xl shadow-2xl border border-[#C6A56B]/30 overflow-hidden my-auto relative flex flex-col max-h-[90vh]">
        
        {/* Compact Top Header */}
        <div className="px-3.5 py-2.5 sm:px-5 sm:py-3.5 bg-[#1D1D1D] text-white border-b border-neutral-800 shrink-0 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2.5 relative z-10">
            {/* User Identity & Avatar */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#2D2D2D] to-[#121212] text-[#C6A56B] flex items-center justify-center font-serif text-xs sm:text-base font-bold border border-[#C6A56B]/40 shadow-inner">
                  {currentCustomer.name.charAt(0)}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#C6A56B] text-[#1D1D1D] rounded-full flex items-center justify-center shadow-sm">
                  <Crown className="w-2 h-2" />
                </div>
              </div>

              <div className="min-w-0">
                <h2 className="font-serif text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                  {currentCustomer.name}
                </h2>
                <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-light truncate">
                  <span className="truncate flex items-center gap-1">
                    <Mail className="w-2.5 h-2.5 text-[#C6A56B]" />
                    {currentCustomer.email}
                  </span>
                  {currentCustomer.phone && (
                    <span className="hidden sm:flex items-center gap-1 text-neutral-400">
                      <span className="text-neutral-600">•</span>
                      <Phone className="w-2.5 h-2.5 text-[#C6A56B]" />
                      {currentCustomer.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsAccountOpen(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors shrink-0"
              aria-label="Close Profile"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Compact Navigation Tabs Bar */}
        <div className="bg-white border-b border-neutral-200 px-3 py-1.5 sm:px-5 sm:py-2 shrink-0 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'details'
                  ? 'bg-[#1D1D1D] text-[#C6A56B] shadow-sm'
                  : 'text-neutral-600 hover:bg-[#F8F5F2] hover:text-[#1D1D1D]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Account Info</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'addresses'
                  ? 'bg-[#1D1D1D] text-[#C6A56B] shadow-sm'
                  : 'text-neutral-600 hover:bg-[#F8F5F2] hover:text-[#1D1D1D]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Addresses</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'addresses' ? 'bg-[#C6A56B] text-[#1D1D1D]' : 'bg-neutral-100 text-neutral-600'
              }`}>
                {currentCustomer.addresses?.length || 0}
              </span>
            </button>
          </div>

          {/* Quick Concierge Link (Desktop) */}
          <button
            onClick={() => {
              setIsAccountOpen(false);
              setActiveView('contact');
            }}
            className="hidden sm:flex items-center gap-1 text-[10px] text-[#C6A56B] hover:text-[#1D1D1D] font-bold uppercase tracking-wider transition-colors"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>Concierge Support</span>
          </button>
        </div>

        {/* Content Canvas */}
        <div className="flex-1 p-3 sm:p-5 overflow-y-auto no-scrollbar space-y-3">
          
          {/* TAB 1: ACCOUNT DETAILS */}
          {activeTab === 'details' && (
            <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-neutral-200 shadow-sm space-y-3">
              <div>
                <h3 className="font-serif text-xs sm:text-sm font-bold text-[#1D1D1D] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#C6A56B]" />
                  <span>Personal Account Information</span>
                </h3>
                <p className="text-[10px] sm:text-[11px] text-neutral-500 font-light mt-0.5">
                  Update contact details for orders and notifications.
                </p>
              </div>

              <form onSubmit={handleSaveDetails} className="space-y-2.5 sm:space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1 text-[10px] sm:text-[11px]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={detailsForm.name}
                      onChange={(e) => setDetailsForm({ ...detailsForm, name: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#F8F5F2] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#C6A56B] text-[11px] sm:text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1 text-[10px] sm:text-[11px]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={detailsForm.email}
                      onChange={(e) => setDetailsForm({ ...detailsForm, email: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#F8F5F2] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#C6A56B] text-[11px] sm:text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1 text-[10px] sm:text-[11px]">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={detailsForm.phone}
                    onChange={(e) => setDetailsForm({ ...detailsForm, phone: e.target.value })}
                    placeholder="+44 20 7946 0912"
                    className="w-full px-2.5 py-1.5 bg-[#F8F5F2] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#C6A56B] text-[11px] sm:text-xs font-medium"
                  />
                </div>

                <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="text-[9.5px] sm:text-[10px] text-neutral-400 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-[#C6A56B]" />
                    <span>Encrypted client record protection</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-1.5 bg-[#1D1D1D] hover:bg-[#C6A56B] text-white font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px]"
                  >
                    <Check className="w-3 h-3 text-[#C6A56B]" />
                    <span>Save Profile</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 pb-1.5">
                <div>
                  <h3 className="font-serif text-xs sm:text-sm font-bold text-[#1D1D1D]">
                    Saved Delivery Addresses
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-neutral-500 font-light">
                    Manage destination addresses for fast checkout.
                  </p>
                </div>

                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-[#1D1D1D] hover:bg-[#C6A56B] text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1 shadow-sm shrink-0"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Address</span>
                  </button>
                )}
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form
                  onSubmit={handleAddAddressSubmit}
                  className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#C6A56B]/60 shadow-md space-y-2.5 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                    <h4 className="font-serif font-bold text-xs text-[#1D1D1D] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C6A56B]" />
                      <span>New Delivery Destination</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-0.5 text-[10px]">Recipient Name *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        placeholder="e.g. Charlotte De La Tour"
                        className="w-full px-2.5 py-1.5 bg-[#F8F5F2] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#C6A56B] text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-0.5 text-[10px]">Direct Phone *</label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        placeholder="+33 6 12 34 56 78"
                        className="w-full px-2.5 py-1.5 bg-[#F8F5F2] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#C6A56B] text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block font-semibold text-neutral-700 mb-0.5 text-[10px]">Street Address & Apartment *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      placeholder="15 Rue de la Paix, Apt 4B"
                      className="w-full px-2.5 py-1.5 bg-[#F8F5F2] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#C6A56B] text-[11px]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-0.5 text-[10px]">City *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        placeholder="Paris"
                        className="w-full px-2 py-1.5 bg-[#F8F5F2] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#C6A56B] text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-0.5 text-[10px]">Postal Code</label>
                      <input
                        type="text"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                        placeholder="75002"
                        className="w-full px-2 py-1.5 bg-[#F8F5F2] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#C6A56B] text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-0.5 text-[10px]">Country</label>
                      <input
                        type="text"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                        placeholder="France"
                        className="w-full px-2 py-1.5 bg-[#F8F5F2] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#C6A56B] text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-[#1D1D1D] hover:bg-[#C6A56B] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                    >
                      Save Destination
                    </button>
                  </div>
                </form>
              )}

              {/* Address Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentCustomer.addresses?.map((addr, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-3 rounded-xl border border-neutral-200 shadow-sm space-y-1.5 relative group hover:border-[#C6A56B]/70 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="inline-block px-1.5 py-0.2 bg-[#FAF8F5] text-[#C6A56B] text-[9px] font-bold uppercase tracking-wider rounded border border-[#C6A56B]/30">
                          {idx === 0 ? 'Primary' : `Address #${idx + 1}`}
                        </span>

                        {currentCustomer.addresses.length > 1 && (
                          <button
                            onClick={() => deleteCustomerAddress(currentCustomer.id, idx)}
                            className="text-neutral-400 hover:text-rose-600 transition-colors p-0.5"
                            title="Delete Address"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <h4 className="font-bold text-xs text-neutral-900 font-serif">{addr.fullName}</h4>
                      <p className="text-[10px] sm:text-[11px] text-neutral-600 leading-relaxed mt-0.5">
                        {addr.street} {addr.apartment && `, ${addr.apartment}`}
                        <br />
                        {addr.city}, {addr.state} {addr.postalCode} • {addr.country}
                      </p>
                    </div>

                    <p className="text-[9.5px] text-neutral-400 pt-1 border-t border-neutral-100 flex items-center gap-1">
                      <Phone className="w-2.5 h-2.5 text-[#C6A56B]" />
                      <span>{addr.phone}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
