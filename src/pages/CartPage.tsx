import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ShieldCheck, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useRouter } from '../context/RouterContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    cartCount,
    freeShippingRemaining,
    freeShippingProgress,
    standardShippingFee,
  } = useCart();
  const { navigate } = useRouter();

  const total = subtotal + standardShippingFee;

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6">
          <Link to="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-semibold">Your Shopping Cart</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 pb-4 border-b border-slate-200 gap-2">
          <h1 className="font-display text-3xl sm:text-4xl font-black text-[#071525] tracking-tight">
            Your Cart
          </h1>
          <span className="text-slate-500 text-sm font-medium">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} ready for checkout
          </span>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200 max-w-2xl mx-auto shadow-sm space-y-5">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Your cart is currently empty
              </h2>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Discover our range of 3D printed display figures, LED bases, succulent planters, and keychains.
              </p>
            </div>
            <button
              id="cart-page-start-shopping-btn"
              onClick={() => navigate('/shop')}
              className="px-8 py-3.5 bg-[#FFD21F] hover:bg-[#E5BC1B] text-[#071525] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Explore Collectibles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: CART ITEMS LIST */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Free Delivery Bar Banner */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Truck className="w-4 h-4 text-[#FFD21F]" />
                    {freeShippingRemaining > 0 ? (
                      <span>
                        Add <strong className="text-[#071525] font-mono">£{freeShippingRemaining.toFixed(2)}</strong> more to unlock <strong className="text-emerald-600">FREE UK Delivery</strong>
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold">
                        Congratulations! You have qualified for FREE UK Standard Delivery
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-slate-500">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#071525] h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Table / Cards */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedVariant || ''}`}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 group"
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => navigate(`/product/${item.product.slug}`)}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 cursor-pointer"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() => navigate(`/product/${item.product.slug}`)}
                        className="font-display font-bold text-base sm:text-lg text-slate-900 hover:text-amber-600 cursor-pointer transition-colors truncate"
                      >
                        {item.product.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="capitalize">{item.product.category.replace('-', ' & ')}</span>
                        {item.selectedVariant && (
                          <>
                            <span>•</span>
                            <span>Variant: <strong className="text-slate-700">{item.selectedVariant}</strong></span>
                          </>
                        )}
                      </div>

                      <div className="text-xs font-mono text-slate-500 mt-1">
                        Unit price: £{item.product.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
                          className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-slate-900 min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant)}
                          className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <div className="font-mono font-black text-base sm:text-lg text-[#071525]">
                          £{(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-2 flex justify-between items-center text-xs">
                <button
                  onClick={() => navigate('/shop')}
                  className="text-slate-600 hover:text-slate-900 font-semibold underline flex items-center gap-1"
                >
                  ← Continue Shopping
                </button>
                <span className="text-slate-400">All prices include VAT where applicable</span>
              </div>
            </div>

            {/* RIGHT: SUMMARY CARD */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6 sticky top-24">
                <h2 className="font-display font-extrabold text-xl text-[#071525] border-b border-slate-100 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-mono font-semibold text-slate-900">
                      £{subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <div>
                      <span>Estimated UK Delivery</span>
                      <div className="text-[11px] text-slate-400">Royal Mail 48 Tracked</div>
                    </div>
                    <span className="font-mono font-semibold text-slate-900">
                      {standardShippingFee === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        `£${standardShippingFee.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                    <div>
                      <span className="font-display font-extrabold text-base text-slate-900">Total</span>
                      <div className="text-[11px] text-slate-500">Including all UK taxes</div>
                    </div>
                    <span className="font-mono font-black text-2xl text-[#071525]">
                      £{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    id="cart-proceed-checkout-btn"
                    onClick={() => navigate('/checkout')}
                    className="w-full py-4 px-6 rounded-2xl bg-[#FFD21F] hover:bg-[#E5BC1B] text-[#071525] font-black text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant Guest Checkout (No Account Needed)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#071525] shrink-0" />
                    <span>Dispatched in protective collector packaging</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
