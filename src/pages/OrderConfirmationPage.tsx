import React from 'react';
import { CheckCircle2, Printer, Package, ArrowRight, Sparkles, MapPin, Calendar } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';

export const OrderConfirmationPage: React.FC = () => {
  const { lastOrder } = useCart();
  const { navigate } = useRouter();

  // Fallback demo order if visited directly
  const order = lastOrder || {
    orderNumber: 'PC-84721',
    date: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    customer: {
      email: 'collector.fan@example.co.uk',
      firstName: 'Alex',
      lastName: 'Morgan',
      address: '42 Oakfield Road',
      apartment: 'Flat 3B',
      city: 'Bristol',
      postcode: 'BS8 2AT',
      country: 'United Kingdom',
      shippingMethodId: 'standard',
    },
    items: [],
    subtotal: 44.98,
    shippingFee: 0,
    total: 44.98,
    estimatedDelivery: '3–5 working days',
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center space-y-6">
          
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-95 duration-300">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD21F]" />
              Order #{order.orderNumber}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-black text-[#071525] tracking-tight">
              Thank You For Your Order!
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
              We&apos;ve sent a confirmation email to <strong className="text-slate-900">{order.customer.email}</strong>.
            </p>
          </div>

          {/* 3D Printer Warm-up Status Box */}
          <div className="p-5 rounded-2xl bg-[#071525] text-white border border-slate-800 text-left flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFD21F] text-[#071525] flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-[#FFD21F]">
                Printers Warming Up!
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Our print beds are heating to 60°C and nozzles to 215°C. Your collectibles are queued for slicing and ultra-fine extrusion.
              </p>
            </div>
          </div>

          {/* Key Order Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Estimated Delivery</span>
              </div>
              <div className="font-display font-extrabold text-slate-900 text-base">
                {order.estimatedDelivery}
              </div>
              <div className="text-xs text-slate-500">
                Dispatched via Royal Mail Tracked
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <MapPin className="w-3.5 h-3.5" />
                <span>Delivery Address</span>
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {order.customer.firstName} {order.customer.lastName}
              </div>
              <div className="text-xs text-slate-600 truncate">
                {order.customer.address}, {order.customer.city} {order.customer.postcode}
              </div>
            </div>

          </div>

          {/* Items Summary (if available) */}
          {order.items.length > 0 && (
            <div className="text-left pt-6 border-t border-slate-100 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Purchased Items ({order.items.length})
              </div>
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {order.items.map((item, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{item.product.name}</div>
                        {item.selectedVariant && (
                          <div className="text-[11px] text-slate-500">{item.selectedVariant}</div>
                        )}
                        <div className="text-slate-400">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-slate-900">
                      £{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Paid</span>
                <span className="font-mono text-base font-black text-[#071525]">
                  £{order.total.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="order-confirmation-continue-shopping-btn"
              onClick={() => navigate('/shop')}
              className="px-8 py-4 bg-[#FFD21F] hover:bg-[#E5BC1B] text-[#071525] font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md inline-flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all"
            >
              Back To Home
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
