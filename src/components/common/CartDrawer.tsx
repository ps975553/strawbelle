import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag
} from 'lucide-react';
import { orderCartViaWhatsApp } from '../../utils/socialOrder';
import { FREE_SHIPPING_THRESHOLD_USD } from '../../utils/shipping';
import type { Product } from '../../types';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    products,
    addToCart,
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
    setActiveView,
    navigateToProduct,
    showToast
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const discountedSubtotal = Math.max(0, cartSubtotal - cartDiscount);
  const amountForFreeDelivery = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - discountedSubtotal);
  const freeDeliveryProgress = Math.min(100, (discountedSubtotal / FREE_SHIPPING_THRESHOLD_USD) * 100);
  const limitedOfferSavings = cart.reduce((savings, item) => {
    const originalPrice = Number(item.product?.oldPrice) || 0;
    const currentPrice = Number(item.product?.price) || 0;
    const quantity = Number(item.quantity) || 1;
    return savings + Math.max(0, originalPrice - currentPrice) * quantity;
  }, 0);

  useEffect(() => {
    if (!isCartOpen) return;

    const cartProductIds = new Set(cart.map((item) => item.product.id));
    const availableProducts = products.filter(
      (product) => product.status === 'published' && !cartProductIds.has(product.id)
    );
    for (let index = availableProducts.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [availableProducts[index], availableProducts[randomIndex]] = [availableProducts[randomIndex], availableProducts[index]];
    }
    setSuggestedProducts(availableProducts.slice(0, 3));
  }, [isCartOpen, products, cart]);

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

  const handleWhatsAppOrder = () => {
    orderCartViaWhatsApp({
      cart,
      cartSubtotal,
      cartDiscount,
      cartShipping,
      cartTotal,
      formatPrice,
      appliedCouponCode: appliedCoupon?.code,
      onToast: showToast,
    });
  };

  const handleBrowseCatalog = () => {
    setIsCartOpen(false);
    setActiveView('shop');
  };

  const handleOpenProduct = (productId: string) => {
    setIsCartOpen(false);
    navigateToProduct(productId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden viewport-full">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F8F5F2] shadow-2xl flex flex-col justify-between border-l border-[#C6A56B]/30 animate-in slide-in-from-right duration-300 h-full">
          {/* Header */}
          <div className="p-3.5 sm:p-6 bg-white border-b border-neutral-200 flex items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#C6A56B] shrink-0" />
              <h2 className="font-serif text-base sm:text-lg font-bold tracking-wider uppercase text-[#1D1D1D] whitespace-nowrap">
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
                  className="text-[9px] sm:text-[11px] text-neutral-400 hover:text-rose-500 uppercase tracking-wider font-semibold transition-colors mr-1 whitespace-nowrap"
                >
                  <span className="sm:hidden">Clear</span>
                  <span className="hidden sm:inline">Clear Cart</span>
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
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-4">
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
                    <button
                      type="button"
                      onClick={() => handleOpenProduct(prodId)}
                      aria-label={`View ${item.product?.title}`}
                      className="w-20 h-24 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-neutral-200/80 flex items-center justify-center p-1.5"
                    >
                      <img
                        src={item.product?.thumbnail || ''}
                        alt={item.product?.title || 'Handbag'}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </button>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenProduct(prodId)}
                            className="text-left font-serif text-sm font-semibold text-[#1D1D1D] line-clamp-2 break-words whitespace-normal leading-snug hover:text-[#C6A56B]"
                          >
                            {item.product?.title}
                          </button>
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
                            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 hover:text-[#C6A56B] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold px-2 text-neutral-800">
                            {itemQty}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(prodId, colorName, itemQty + 1)}
                            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 hover:text-[#C6A56B] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex flex-col items-end">
                          {Number(item.product?.oldPrice) > itemPrice && (
                            <>
                              <span className="rounded bg-[#C6A56B]/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-[#8A6A32]">
                                Limited Time Offer
                              </span>
                              <span className="text-[10px] text-neutral-400 line-through">
                                {formatPrice(Number(item.product.oldPrice) * itemQty)}
                              </span>
                            </>
                          )}
                          <span className="font-semibold text-sm text-[#1D1D1D]">
                            {formatPrice(itemPrice * itemQty)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {suggestedProducts.length > 0 && (
              <section className="pt-2" aria-label="Suggested products">
                <h3 className="mb-2 font-serif text-sm font-semibold text-[#1D1D1D]">You may also like</h3>
                <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                  {suggestedProducts.map((product) => (
                    <article key={product.id} className="w-28 sm:w-32 shrink-0 rounded-xl border border-neutral-200 bg-white p-2">
                      <button type="button" onClick={() => handleOpenProduct(product.id)} className="block w-full text-left" aria-label={`View ${product.title}`}>
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="h-20 w-full rounded-lg bg-[#FAF8F5] object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="mt-1.5 block line-clamp-2 min-h-8 text-[10px] font-semibold leading-tight text-[#1D1D1D]">
                          {product.title}
                        </span>
                        {Number(product.oldPrice) > product.price && (
                          <span className="mt-1 block text-[7px] font-bold uppercase tracking-wide text-[#8A6A32]">
                            Limited Time Offer
                          </span>
                        )}
                      </button>
                      <div className="mt-1.5 flex items-center justify-between gap-1">
                        <div className="flex flex-col">
                          {Number(product.oldPrice) > product.price && (
                            <span className="text-[9px] text-neutral-400 line-through">{formatPrice(product.oldPrice!)}</span>
                          )}
                          <span className="text-[11px] font-bold text-[#1D1D1D]">{formatPrice(product.price)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart(product, product.colors?.[0], 1)}
                          aria-label={`Add ${product.title} to cart`}
                          className="flex min-h-8 min-w-8 items-center justify-center rounded-lg bg-[#1D1D1D] text-white transition-colors hover:bg-[#C6A56B]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-3.5 sm:p-5 safe-area-bottom bg-white border-t border-neutral-200 space-y-2.5 sm:space-y-3">
              <div className="rounded-lg border border-[#C6A56B]/30 bg-[#F8F5F2] px-3 py-2">
                <p className="text-[10px] sm:text-[11px] text-neutral-700">
                  {amountForFreeDelivery > 0
                    ? <>Add <strong className="text-[#1D1D1D]">{formatPrice(amountForFreeDelivery)}</strong> more for free delivery on orders of {formatPrice(FREE_SHIPPING_THRESHOLD_USD)} or more.</>
                    : <strong className="text-emerald-700">Your order qualifies for free delivery!</strong>}
                </p>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-[#C6A56B] transition-all"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>

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
                  <span className={`font-semibold ${limitedOfferSavings > 0 ? 'text-neutral-400 line-through' : 'text-neutral-800'}`}>
                    {formatPrice(cartSubtotal + limitedOfferSavings)}
                  </span>
                </div>
                {limitedOfferSavings > 0 && (
                  <>
                    <div className="flex justify-between text-[#8A6A32]">
                      <span>Limited Time Discount</span>
                      <span className="font-semibold">-{formatPrice(limitedOfferSavings)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-neutral-800">
                      <span>Subtotal after discount</span>
                      <span>{formatPrice(cartSubtotal)}</span>
                    </div>
                  </>
                )}
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#C6A56B]">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                  <span>Shipping Charges{cartShipping > 0 ? ' (orders under $80)' : ''}</span>
                  <span className={cartShipping > 0 ? 'font-bold text-[#1D1D1D]' : 'font-bold text-emerald-600'}>
                    {cartShipping > 0 ? formatPrice(cartShipping) : 'FREE'}
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

              {/* WhatsApp Order */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-2.5 sm:py-3 bg-[#1D1D1D] text-[#F8F5F2] hover:bg-[#C6A56B] active:scale-[0.99] text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Order via WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
