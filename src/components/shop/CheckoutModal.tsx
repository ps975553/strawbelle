import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod, Address, Order } from '../../types';
import { getProductShareUrl, copyOrderTextToClipboard, STRAWBELLE_INSTAGRAM_URL, STRAWBELLE_WHATSAPP_PHONE } from '../../utils/socialOrder';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Instagram,
  Copy,
  ExternalLink,
  ShoppingBag,
  Link as LinkIcon
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartEstimatedDuty,
    cartTax,
    cartTotal,
    appliedCoupon,
    formatPrice,
    createOrder,
    setActiveView
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Address Form State
  const [address, setAddress] = useState<Address>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  // Payment Selection (WhatsApp or Instagram only)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('WhatsApp');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const generateOrderMessage = (orderNum: string) => {
    const itemsList = cart
      .map((item, idx) => {
        const productUrl = getProductShareUrl(item.product.id);
        const color = item.selectedColor?.name ? ` | Color: ${item.selectedColor.name}` : '';
        const sku = item.product.sku ? ` | SKU: ${item.product.sku}` : '';
        return [
          `${idx + 1}. 👜 *Handbag:* ${item.product.title}${color}${sku}`,
          `   💰 *Price:* ${formatPrice(item.product.price)} x ${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`,
          `   🔗 *Product Link:* ${productUrl}`
        ].join('\n');
      })
      .join('\n\n');

    return [
      `🏛️ *STRAWBELLE HAUTE MAROQUINERIE — ORDER RESERVATION*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📄 *Order Reference:* ${orderNum}`,
      `👤 *Client:* ${address.fullName}`,
      `📞 *Phone:* ${address.phone}`,
      `📧 *Email:* ${address.email}`,
      `📍 *Delivery Destination:*`,
      `${address.street}${address.apartment ? `, ${address.apartment}` : ''}`,
      `${address.city}, ${address.state} ${address.postalCode}, ${address.country}`,
      ``,
      `👜 *Selected Handbags & Product Links:*`,
      itemsList,
      ``,
      `💰 *Subtotal:* ${formatPrice(cartSubtotal)}`,
      cartDiscount > 0 ? `🎟️ *Promotional Discount:* -${formatPrice(cartDiscount)}` : '',
      `📦 *Worldwide Express Shipping:* FREE`,
      `🏛️ *Estimated Luxury Duty / VAT (8%):* FREE`,
      `💳 *Total Due:* ${formatPrice(cartTotal)}`,
      `📸 *Instagram:* https://www.instagram.com/strawbelle_bags (@strawbelle_bags)`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Please confirm allocation from the Florence atelier and provide the final dispatch instructions. Thank you!`
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const generatedOrderNumber = `SB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderData = {
      customer: address,
      items: cart.map((item) => ({
        productId: item.product.id,
        productTitle: item.product.title,
        productThumbnail: item.product.thumbnail,
        selectedColor: item.selectedColor?.name || 'Signature',
        price: item.product.price,
        quantity: item.quantity,
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      couponCode: appliedCoupon?.code,
      shipping: cartShipping,
      tax: cartTax,
      total: cartTotal,
      paymentMethod: paymentMethod,
      paymentStatus: 'Paid' as const,
      orderStatus: 'Confirmed' as const,
      notes: `Order placed via ${paymentMethod} Concierge Protocol.`,
    };

    const newOrd = createOrder(orderData);
    setPlacedOrder(newOrd);

    const fullOrderText = generateOrderMessage(newOrd.orderNumber || generatedOrderNumber);

    if (paymentMethod === 'WhatsApp') {
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${STRAWBELLE_WHATSAPP_PHONE}&text=${encodeURIComponent(fullOrderText)}`;
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } else if (paymentMethod === 'Instagram') {
      const copied = await copyOrderTextToClipboard(fullOrderText);
      setCopiedText(copied);
      const igUrl = STRAWBELLE_INSTAGRAM_URL;
      if (typeof window !== 'undefined') {
        window.open(igUrl, '_blank', 'noopener,noreferrer');
      }
    }

    setIsProcessing(false);
    setStep('confirmed');

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C6A56B', '#1D1D1D', '#DFBE82', '#FFFFFF'],
      });
    } catch (err) {
      console.log('Confetti not available:', err);
    }
  };

  const handleCopyOrderText = () => {
    if (placedOrder) {
      const fullText = generateOrderMessage(placedOrder.orderNumber);
      copyOrderTextToClipboard(fullText).then((copied) => {
        setCopiedText(copied);
        if (copied) setTimeout(() => setCopiedText(false), 3000);
      });
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('details');
  };

  return (
    <div id="checkout_modal_container" className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-10 animate-in fade-in duration-200 overflow-y-auto no-scrollbar">
      <div id="checkout_modal_content" className="bg-[#F8F5F2] rounded-2xl sm:rounded-3xl w-full max-w-4xl shadow-2xl border border-[#C6A56B]/30 overflow-hidden my-auto relative">
        {/* Top Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-white flex items-center justify-between">
          <h2 className="font-serif text-base sm:text-lg font-bold text-[#1D1D1D] tracking-wide">
            Checkout
          </h2>

          <button
            id="checkout_modal_close_btn"
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Multi-step Content */}
        <div className="p-3 sm:p-6 md:p-8">
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
              {/* Shipping Form */}
              <div className="md:col-span-7 space-y-2.5 sm:space-y-4">
                <div className="flex items-center justify-between pb-0.5 sm:pb-1">
                  <h3 className="font-semibold text-xs sm:text-sm text-[#1D1D1D]">
                    1. Shipping & Contact Details
                  </h3>
                  <span className="text-[9.5px] sm:text-[10px] text-[#C6A56B] font-semibold uppercase tracking-wider">
                    Step 1 of 2
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-neutral-700 mb-0.5 sm:mb-1 text-[10.5px] sm:text-xs">Full Name</label>
                    <input
                      type="text"
                      required
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 bg-white border border-neutral-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#C6A56B] text-[11px] sm:text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-0.5 sm:mb-1 text-[10.5px] sm:text-xs">Email Address</label>
                    <input
                      type="email"
                      required
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      className="w-full px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 bg-white border border-neutral-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#C6A56B] text-[11px] sm:text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-0.5 sm:mb-1 text-[10.5px] sm:text-xs">Direct Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 bg-white border border-neutral-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#C6A56B] text-[11px] sm:text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-neutral-700 mb-0.5 sm:mb-1 text-[10.5px] sm:text-xs">Street Address</label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 bg-white border border-neutral-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#C6A56B] text-[11px] sm:text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-0.5 sm:mb-1 text-[10.5px] sm:text-xs">Apartment / Suite</label>
                    <input
                      type="text"
                      value={address.apartment}
                      onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                      className="w-full px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 bg-white border border-neutral-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#C6A56B] text-[11px] sm:text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-0.5 sm:mb-1 text-[10.5px] sm:text-xs">City</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 bg-white border border-neutral-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#C6A56B] text-[11px] sm:text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-0.5 sm:mb-1 text-[10.5px] sm:text-xs">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 bg-white border border-neutral-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#C6A56B] text-[11px] sm:text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-0.5 sm:mb-1 text-[10.5px] sm:text-xs">Country</label>
                    <input
                      type="text"
                      required
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      className="w-full px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 bg-white border border-neutral-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#C6A56B] text-[11px] sm:text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 sm:pt-4">
                  <button
                    id="checkout_proceed_to_payment_btn"
                    type="submit"
                    className="w-full py-2.5 sm:py-3.5 bg-[#1D1D1D] hover:bg-[#C6A56B] active:scale-[0.99] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
                  >
                    <span>Proceed to Payment Protocol</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Order Overview Sidebar */}
              <div className="md:col-span-5 bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-neutral-200/80 space-y-2.5 sm:space-y-4">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1D1D1D] uppercase tracking-wider pb-1.5 border-b border-neutral-100 flex items-center justify-between">
                  <span>Selected Handbags ({cart.length})</span>
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C6A56B]" />
                </h4>

                <div className="max-h-40 sm:max-h-52 overflow-y-auto no-scrollbar space-y-2 sm:space-y-3 pr-1">
                  {cart.map((item, idx) => {
                    const productUrl = getProductShareUrl(item.product.id);
                    return (
                      <div key={idx} className="flex gap-2 sm:gap-3 text-xs bg-[#FAF8F5] p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-neutral-100">
                        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg border border-neutral-200/60 shrink-0 bg-white flex items-center justify-center p-1">
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <p className="font-bold text-neutral-900 text-[11px] sm:text-xs leading-snug break-words whitespace-normal line-clamp-2">{item.product.title}</p>
                            <p className="text-neutral-500 text-[10px] sm:text-[11px]">
                              {item.selectedColor?.name || 'Signature'} • Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-0.5 sm:pt-1">
                            <span className="text-[#1D1D1D] font-mono font-bold text-[11px] sm:text-xs">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            <a
                              href={productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9.5px] sm:text-[10px] text-[#C6A56B] hover:text-[#1D1D1D] flex items-center gap-0.5 sm:gap-1 font-semibold underline"
                            >
                              <span>Link</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-neutral-100 space-y-1 text-[11px] sm:text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-neutral-800">{formatPrice(cartSubtotal)}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-[#C6A56B]">
                      <span>Discount ({appliedCoupon?.code}):</span>
                      <span className="font-semibold">-{formatPrice(cartDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                    <span>Shipping Charges:</span>
                    <span className="uppercase flex items-center gap-1">
                      <span className="text-neutral-400 line-through font-normal">{formatPrice(65)}</span>
                      <span className="font-bold text-emerald-600">FREE</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                    <span>Estimated Tax:</span>
                    <span className="uppercase flex items-center gap-1">
                      {cartEstimatedDuty > 0 && (
                        <span className="text-neutral-400 line-through font-normal">{formatPrice(cartEstimatedDuty)}</span>
                      )}
                      <span className="font-bold text-emerald-600">FREE</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm font-bold text-[#1D1D1D] pt-1.5 border-t border-neutral-200">
                    <span>Total:</span>
                    <span className="font-serif text-sm sm:text-base">{formatPrice(cartTotal)}</span>
                  </div>
                </div>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              {/* Payment Protocol Selection */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="font-semibold text-xs sm:text-sm text-[#1D1D1D]">
                    2. Select Payment Protocol
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="text-[11px] text-[#C6A56B] hover:underline font-semibold"
                  >
                    Edit Shipping
                  </button>
                </div>

                <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed">
                  Orders are confirmed through direct concierge protocols via WhatsApp or Instagram Direct.
                </p>

                {/* Protocol Selection Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* WhatsApp Protocol */}
                  <button
                    id="protocol_whatsapp_btn"
                    type="button"
                    onClick={() => setPaymentMethod('WhatsApp')}
                    className={`p-3 sm:p-4 rounded-xl border text-left transition-all relative ${
                      paymentMethod === 'WhatsApp'
                        ? 'border-[#25D366] bg-[#1D1D1D] text-white shadow-md ring-1 ring-[#25D366]/30'
                        : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        paymentMethod === 'WhatsApp' ? 'bg-[#25D366] text-white' : 'bg-emerald-50 text-[#25D366]'
                      }`}>
                        <MessageCircle className="w-4 h-4 fill-current" />
                      </div>
                      {paymentMethod === 'WhatsApp' && (
                        <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                      )}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider block">
                      WhatsApp Concierge
                    </span>
                    <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-[#25D366]">
                      <span>Direct Chat Protocol</span>
                    </div>
                  </button>

                  {/* Instagram Protocol */}
                  <button
                    id="protocol_instagram_btn"
                    type="button"
                    onClick={() => setPaymentMethod('Instagram')}
                    className={`p-3 sm:p-4 rounded-xl border text-left transition-all relative ${
                      paymentMethod === 'Instagram'
                        ? 'border-[#E1306C] bg-[#1D1D1D] text-white shadow-md ring-1 ring-[#E1306C]/30'
                        : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        paymentMethod === 'Instagram' ? 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white' : 'bg-rose-50 text-[#E1306C]'
                      }`}>
                        <Instagram className="w-4 h-4" />
                      </div>
                      {paymentMethod === 'Instagram' && (
                        <CheckCircle2 className="w-4 h-4 text-[#E1306C]" />
                      )}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider block">
                      Instagram Direct
                    </span>
                    <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-[#E1306C]">
                      <span>VIP DM Protocol</span>
                    </div>
                  </button>
                </div>

                <button
                  id="checkout_complete_order_btn"
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3 sm:py-3.5 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === 'WhatsApp'
                      ? 'bg-[#1D1D1D] hover:bg-[#25D366] hover:text-white'
                      : 'bg-[#1D1D1D] hover:bg-gradient-to-r hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white'
                  }`}
                >
                  {isProcessing ? (
                    <span>Initiating Order Protocol...</span>
                  ) : paymentMethod === 'WhatsApp' ? (
                    <>
                      <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
                      <span>Order via WhatsApp Concierge ({formatPrice(cartTotal)})</span>
                    </>
                  ) : (
                    <>
                      <Instagram className="w-4 h-4 text-[#E1306C]" />
                      <span>Order via Instagram Direct ({formatPrice(cartTotal)})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Order details & Handbag summary sidebar */}
              <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-neutral-200/80 space-y-4">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1D1D1D] uppercase tracking-wider pb-2 border-b border-neutral-100 flex items-center justify-between">
                    <span>Selected Handbags ({cart.length})</span>
                    <ShoppingBag className="w-4 h-4 text-[#C6A56B]" />
                  </h4>

                  {/* Itemized Handbags with Name, Price, and Direct Link */}
                  <div className="max-h-48 overflow-y-auto no-scrollbar space-y-2.5 pr-1 mt-2.5">
                    {cart.map((item, idx) => {
                      const productUrl = getProductShareUrl(item.product.id);
                      return (
                        <div key={idx} className="bg-[#FAF8F5] p-2.5 rounded-xl border border-neutral-100 flex gap-3 text-xs">
                          <div className="w-12 h-12 rounded-lg border border-neutral-200/60 shrink-0 bg-white flex items-center justify-center p-1">
                            <img
                              src={item.product.thumbnail}
                              alt={item.product.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <p className="font-bold text-neutral-900 leading-snug break-words whitespace-normal line-clamp-2">{item.product.title}</p>
                              <span className="text-[#1D1D1D] font-mono font-bold shrink-0">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                            </div>
                            <p className="text-neutral-500 text-[11px]">
                              {item.selectedColor?.name || 'Signature'} • Unit: {formatPrice(item.product.price)} (Qty: {item.quantity})
                            </p>
                            <a
                              href={productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-[#C6A56B] hover:text-[#1D1D1D] flex items-center gap-1 font-semibold underline mt-1"
                            >
                              <LinkIcon className="w-2.5 h-2.5" />
                              <span className="break-words whitespace-normal leading-snug">Handbag Link: {item.product.title}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Deliver Destination:
                  </h5>
                  <div className="text-xs text-neutral-700">
                    <p className="font-semibold text-neutral-900">{address.fullName}</p>
                    <p className="text-[11px] text-neutral-500">{address.street}, {address.city}, {address.country}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-neutral-800">{formatPrice(cartSubtotal)}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-[#C6A56B]">
                      <span>Discount ({appliedCoupon?.code}):</span>
                      <span className="font-semibold">-{formatPrice(cartDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Worldwide Express Shipping:</span>
                    <span className="uppercase flex items-center gap-1.5">
                      <span className="text-neutral-400 line-through font-normal">{formatPrice(65)}</span>
                      <span className="font-bold text-emerald-600">FREE</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Estimated Luxury Duty / VAT (8%):</span>
                    <span className="uppercase flex items-center gap-1.5">
                      {cartEstimatedDuty > 0 && (
                        <span className="text-neutral-400 line-through font-normal">{formatPrice(cartEstimatedDuty)}</span>
                      )}
                      <span className="font-bold text-emerald-600">FREE</span>
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#1D1D1D] pt-2 border-t border-neutral-200">
                    <span>Total Charge:</span>
                    <span className="font-serif text-base">{formatPrice(cartTotal)}</span>
                  </div>
                </div>
              </div>
            </form>
          )}

          {step === 'confirmed' && placedOrder && (
            <div className="text-center py-6 sm:py-8 max-w-lg mx-auto space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-[#1D1D1D] border-2 border-[#C6A56B] flex items-center justify-center mx-auto text-[#C6A56B] shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C6A56B]">
                  Order Confirmed
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1D1D1D] mt-1">
                  Thank You, {placedOrder.customer.fullName}
                </h3>
                <p className="text-xs text-neutral-500 mt-1.5 font-light leading-relaxed">
                  Your luxury order has been registered with reference <span className="font-mono font-bold text-neutral-800">{placedOrder.orderNumber}</span> and transmitted to our atelier.
                </p>
              </div>

              {/* Handbag items list in confirmation */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 text-xs space-y-3 text-left">
                <div className="flex justify-between pb-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Order Reference:</span>
                  <span className="font-mono font-bold text-[#1D1D1D]">{placedOrder.orderNumber}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Ordered Silhouettes:
                  </span>
                  {placedOrder.items.map((item, idx) => {
                    const productUrl = getProductShareUrl(item.productId);
                    return (
                      <div key={idx} className="flex justify-between items-center bg-[#FAF8F5] p-2 rounded-lg text-[11px]">
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-neutral-900 leading-snug break-words whitespace-normal line-clamp-2">{item.productTitle}</p>
                          <a
                            href={productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#C6A56B] hover:underline flex items-center gap-1 text-[10px] mt-0.5"
                          >
                            <LinkIcon className="w-2.5 h-2.5" />
                            <span>View Handbag Link</span>
                          </a>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono font-semibold">{formatPrice(item.price * item.quantity)}</span>
                          <span className="text-neutral-400 block text-[10px]">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
                  <span className="text-neutral-500">Payment Protocol:</span>
                  <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
                    {placedOrder.paymentMethod === 'WhatsApp' ? (
                      <>
                        <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-current" />
                        <span>WhatsApp Concierge</span>
                      </>
                    ) : (
                      <>
                        <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                        <span>Instagram Direct</span>
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-100 font-bold text-sm">
                  <span>Total Amount:</span>
                  <span className="font-serif text-[#1D1D1D]">{formatPrice(placedOrder.total)}</span>
                </div>
              </div>

              {/* Action Buttons for social protocol re-launch */}
              <div className="flex flex-col gap-2.5 pt-1">
                {placedOrder.paymentMethod === 'WhatsApp' ? (
                  <button
                    onClick={() => {
                      const msg = generateOrderMessage(placedOrder.orderNumber);
                      window.open(`https://api.whatsapp.com/send?phone=${STRAWBELLE_WHATSAPP_PHONE}&text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
                    }}
                    className="w-full py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Open WhatsApp Concierge Chat</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleCopyOrderText}
                      className="w-full py-3 bg-[#1D1D1D] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      <Copy className="w-4 h-4 text-[#C6A56B]" />
                      <span>{copiedText ? '✓ Order Copied to Clipboard' : 'Copy Order Text to Clipboard'}</span>
                    </button>
                    <button
                      onClick={() => {
                        window.open(STRAWBELLE_INSTAGRAM_URL, '_blank', 'noopener,noreferrer');
                      }}
                      className="w-full py-3.5 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-md"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>Open Instagram Direct (@strawbelle_bags)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => {
                      handleClose();
                      setActiveView('home');
                    }}
                    className="w-full py-3 bg-[#1D1D1D] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#C6A56B] transition-colors"
                  >
                    Return to Boutique
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
