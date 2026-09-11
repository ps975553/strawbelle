import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { getProductShareUrl } from '../../utils/socialOrder';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartEstimatedDuty,
    cartTax,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    formatPrice,
    setIsCheckoutOpen,
    setActiveView,
    showToast
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBrowseCatalog = () => {
    setIsCartOpen(false);
    setActiveView('shop');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F8F5F2] shadow-2xl flex flex-col justify-between border-l border-[#C6A56B]/30 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 bg-white border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C6A56B]" />
              <h2 className="font-serif text-lg font-bold tracking-wider uppercase text-[#1D1D1D]">
                Shopping Cart
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 bg-[#F8F5F2] text-neutral-600 rounded-full border border-neutral-200">
                {cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[11px] text-neutral-400 hover:text-rose-500 uppercase tracking-wider font-semibold transition-colors mr-1"
                >
                  Clear Cart
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#1D1D1D]">Your cart is empty</h3>
                  <p className="text-xs text-neutral-500 max-w-xs mt-1 leading-relaxed">
                    Explore our curated collection of artisanal luxury pieces.
                  </p>
                </div>
                <button
                  onClick={handleBrowseCatalog}
                  className="px-6 py-3 bg-[#1D1D1D] text-white text-xs font-semibold uppercase tracking-widest rounded-xl hover:bg-[#C6A56B] transition-colors flex items-center gap-2"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              cart.map((item, idx) => {
                const itemQty = Number(item.quantity) || 1;
                const itemPrice = Number(item.product?.price) || 0;
                const colorName = item.selectedColor?.name || 'Signature';
                const prodId = item.product?.id || `item-${idx}`;

                return (
                  <div
                    key={`${prodId}-${colorName}`}
                    className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-sm flex gap-4 relative group"
                  >
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-neutral-200/80 flex items-center justify-center p-1.5">
                      <img
                        src={item.product?.thumbnail || ''}
                        alt={item.product?.title || 'Handbag'}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-sm font-semibold text-[#1D1D1D] line-clamp-1">
                            {item.product?.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(prodId, colorName)}
                            className="text-neutral-400 hover:text-rose-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                        {/* Quantity Controller */}
                        <div className="flex items-center border border-neutral-200 rounded-lg bg-[#F8F5F2]">
                          <button
                            onClick={() => updateCartQuantity(prodId, colorName, itemQty - 1)}
                            className="p-1.5 hover:text-[#C6A56B] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold px-2 text-neutral-800">
                            {itemQty}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(prodId, colorName, itemQty + 1)}
                            className="p-1.5 hover:text-[#C6A56B] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-semibold text-sm text-[#1D1D1D]">
                          {formatPrice(itemPrice * itemQty)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-3.5 sm:p-5 bg-white border-t border-neutral-200 space-y-2.5 sm:space-y-3">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 bg-[#F8F5F2] rounded-xl border border-[#C6A56B]/40 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#C6A56B]" />
                    <span className="font-bold text-[#1D1D1D] tracking-wider uppercase text-[11px]">
                      {appliedCoupon.code}
                    </span>
                    <span className="text-[#C6A56B] font-medium text-[11px]">
                      (-
                      {appliedCoupon.discountType === 'percentage'
                        ? `${appliedCoupon.discountValue}%`
                        : formatPrice(appliedCoupon.discountValue)}
                      )
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-neutral-400 hover:text-rose-500 text-[10px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="Coupon Code"
                      className="flex-1 px-3 py-1.5 text-[11px] sm:text-xs bg-[#F8F5F2] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#C6A56B] uppercase tracking-wider"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#1D1D1D] text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#C6A56B] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-rose-500 pl-1">{couponError}</p>}
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-[11px] sm:text-xs text-neutral-600 border-t border-neutral-100 pt-2.5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-800">{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#C6A56B]">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                  <span>Shipping Charges</span>
                  <span className="uppercase flex items-center gap-1">
                    <span className="text-neutral-400 line-through font-normal">{formatPrice(65)}</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                  <span>Estimated Tax</span>
                  <span className="uppercase flex items-center gap-1">
                    {cartEstimatedDuty > 0 && (
                      <span className="text-neutral-400 line-through font-normal">{formatPrice(cartEstimatedDuty)}</span>
                    )}
                    <span className="font-bold text-emerald-600">FREE</span>
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm font-bold text-[#1D1D1D] pt-1.5 border-t border-neutral-200">
                  <span>Total Amount</span>
                  <span className="font-serif text-sm sm:text-base text-[#1D1D1D]">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Compact Checkout Trigger */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-2.5 sm:py-3 bg-[#1D1D1D] text-[#F8F5F2] hover:bg-[#C6A56B] active:scale-[0.99] text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Proceed to Luxury Checkout</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-[#C6A56B]" />
                <span>SSL Encrypted Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
