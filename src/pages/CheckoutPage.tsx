import React, { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, CheckCircle2, ChevronRight, Truck, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useRouter } from '../context/RouterContext';
import { CheckoutFormData, PlacedOrder } from '../types';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, freeShippingThreshold, setLastOrder, clearCart } = useCart();
  const { navigate } = useRouter();

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: 'collector.fan@example.co.uk',
    firstName: 'Alex',
    lastName: 'Morgan',
    address: '42 Oakfield Road',
    apartment: 'Flat 3B',
    city: 'Bristol',
    postcode: 'BS8 2AT',
    country: 'United Kingdom',
    shippingMethodId: 'standard',
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '888',
    cardName: 'Alex Morgan',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, show redirection notice
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] py-16 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="font-display font-bold text-xl text-slate-900">Your cart is empty</h2>
          <p className="text-slate-500 text-xs">
            Add some 3D printed figures or accessories before heading to checkout.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="w-full py-3 bg-[#071525] text-white font-bold text-xs uppercase tracking-wider rounded-xl"
          >
            Explore Collectibles
          </button>
        </div>
      </div>
    );
  }

  // Calculate delivery fee
  const isFreeStandard = subtotal >= freeShippingThreshold;
  const standardFee = isFreeStandard ? 0 : 3.99;
  const deliveryFee = deliveryMethod === 'standard' ? standardFee : 6.99;
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            name: item.product.name + (item.selectedVariant ? ` (${item.selectedVariant})` : ''),
            image: item.product.images[0],
            price: item.product.price,
            quantity: item.quantity
          })),
          email: formData.email
        }),
      });

      const session = await response.json();
      
      if (session.error) {
        console.error('Checkout error:', session.error);
        alert('Checkout error: ' + session.error);
        setIsSubmitting(false);
        return;
      }

      // If Stripe returns a URL, navigate to it (handles both real Stripe and mock fallback)
      if (session.url) {
        // We do a mock clear here since we're leaving the app. 
        // In a real app, webhooks clear the cart or handle success.
        clearCart();
        window.location.href = session.url;
      }
    } catch (err) {
      console.error('Error initiating checkout:', err);
      alert('Could not initiate checkout. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-8">
          <Link to="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link to="/cart" className="hover:text-slate-900 transition-colors">
            Cart
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-semibold">Guest Checkout</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: CHECKOUT FORMS */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleSubmitOrder} className="space-y-8">
              
              {/* Top Banner: Guest Checkout Notice */}
              <div className="p-4 rounded-2xl bg-[#071525] text-white flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFD21F] text-[#071525] flex items-center justify-center font-black shrink-0">
                    ✓
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm">Guest Checkout Active</div>
                    <div className="text-xs text-slate-300">No account or password creation required.</div>
                  </div>
                </div>
                <div className="text-[11px] font-mono font-bold text-[#FFD21F] uppercase tracking-wider hidden sm:inline">
                  Fast &amp; Private
                </div>
              </div>

              {/* 1. Contact Information */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="font-display font-extrabold text-lg text-[#071525] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#071525] text-[#FFD21F] text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                    Contact Information
                  </h2>
                  <span className="text-xs text-slate-400">Order updates will be sent here</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="checkout-email-input"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.co.uk"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#071525]"
                  />
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="font-display font-extrabold text-lg text-[#071525] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#071525] text-[#FFD21F] text-xs flex items-center justify-center font-bold">
                      2
                    </span>
                    Shipping Address (UK)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Alex"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#071525]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Morgan"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#071525]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="42 High Street"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#071525]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Apartment, suite, unit (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.apartment || ''}
                    onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                    placeholder="Apartment 4B"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#071525]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      City / Town
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Bristol"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#071525]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Postcode
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                      placeholder="BS8 2AT"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#071525]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    value="United Kingdom"
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-600 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              {/* 3. Delivery Method Selection */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="font-display font-extrabold text-lg text-[#071525] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#071525] text-[#FFD21F] text-xs flex items-center justify-center font-bold">
                      3
                    </span>
                    Delivery Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Standard */}
                  <label
                    onClick={() => setDeliveryMethod('standard')}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryMethod === 'standard'
                        ? 'border-[#071525] bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          deliveryMethod === 'standard'
                            ? 'border-[#071525] bg-[#071525]'
                            : 'border-slate-400'
                        }`}
                      >
                        {deliveryMethod === 'standard' && (
                          <div className="w-2 h-2 rounded-full bg-[#FFD21F]" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Standard Delivery (Royal Mail 48 Tracked)</div>
                        <div className="text-xs text-slate-500">Delivered in 3–5 working days</div>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-slate-900 text-sm">
                      {isFreeStandard ? (
                        <span className="text-emerald-600 font-black">FREE</span>
                      ) : (
                        '£3.99'
                      )}
                    </div>
                  </label>

                  {/* Express */}
                  <label
                    onClick={() => setDeliveryMethod('express')}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryMethod === 'express'
                        ? 'border-[#071525] bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          deliveryMethod === 'express'
                            ? 'border-[#071525] bg-[#071525]'
                            : 'border-slate-400'
                        }`}
                      >
                        {deliveryMethod === 'express' && (
                          <div className="w-2 h-2 rounded-full bg-[#FFD21F]" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Express Priority Delivery (DPD Next Day)</div>
                        <div className="text-xs text-slate-500">Delivered in 1–2 working days with 1-hour delivery window</div>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-slate-900 text-sm">
                      £6.99
                    </div>
                  </label>
                </div>
              </div>

              {/* 4. Payment (Mock UI) */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#071525] text-[#FFD21F] text-xs flex items-center justify-center font-bold">
                      4
                    </span>
                    <h2 className="font-display font-extrabold text-lg text-[#071525]">
                      Payment Details
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Secure Checkout</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-2 font-medium">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    Credit / Debit Card (Prototype Simulation)
                  </span>
                  <div className="flex gap-1.5 text-[10px] font-bold text-slate-500">
                    <span className="px-1.5 py-0.5 bg-white rounded border border-slate-200">VISA</span>
                    <span className="px-1.5 py-0.5 bg-white rounded border border-slate-200">MC</span>
                    <span className="px-1.5 py-0.5 bg-white rounded border border-slate-200">AMEX</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-[#071525]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cardExpiry}
                      onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-[#071525]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cardCvc}
                      onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                      placeholder="123"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-[#071525]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                    placeholder="Alex Morgan"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#071525]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="checkout-place-order-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-[#FFD21F] hover:bg-[#E5BC1B] text-[#071525] font-black text-base uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Place Order • £{total.toFixed(2)}</span>
                  </>
                )}
              </button>

              <div className="text-center text-xs text-slate-400">
                This is a frontend demonstration prototype. No actual payment will be taken.
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="font-display font-extrabold text-xl text-[#071525]">
                  Order Summary
                </h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {cart.length} items
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedVariant || ''}`} className="flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#071525] text-white text-[10px] font-bold flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {item.product.name}
                      </div>
                      {item.selectedVariant && (
                        <div className="text-[11px] text-slate-500">{item.selectedVariant}</div>
                      )}
                      <div className="text-xs font-mono text-slate-400">
                        Qty: {item.quantity} × £{item.product.price.toFixed(2)}
                      </div>
                    </div>

                    <div className="font-mono font-bold text-sm text-slate-900 shrink-0">
                      £{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-slate-900">
                    £{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Delivery ({deliveryMethod === 'express' ? 'Express 1–2 days' : 'Standard 3–5 days'})</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `£${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-display font-extrabold text-base text-slate-900">Total</span>
                  <span className="font-mono font-black text-2xl text-[#071525]">
                    £{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Collector Guarantee Note */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>PokeCraft Quality Assurance</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Every 3D print is inspected for clean layer adhesion and safely cushioned in custom bubble wrap and rigid packaging before dispatch.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
