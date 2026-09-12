import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    cartCount,
    freeShippingRemaining,
    freeShippingProgress,
    standardShippingFee,
  } = useCart();
  const { navigate } = useRouter();

  if (!isCartOpen) return null;

  const estimatedTotal = subtotal + standardShippingFee;

  const handleCheckoutClick = async () => {
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
          email: 'guest@example.com' // Can be updated to use authenticated user email if needed
        }),
      });

      const session = await response.json();
      
      if (session.error) {
        console.error('Checkout error:', session.error);
        alert('Checkout error: ' + session.error);
        return;
      }

      // If Stripe returns a URL, navigate to it (handles both real Stripe and mock fallback)
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (err) {
      console.error('Error initiating checkout:', err);
      alert('Could not initiate checkout. Please try again.');
    }
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
    navigate('/shop');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-[#071525]/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0D1B2A] text-white border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#071525]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#FFD21F]" />
              <h2 className="font-display font-bold text-lg tracking-wide uppercase">
                Your Cart <span className="text-slate-400 text-sm font-normal">({cartCount})</span>
              </h2>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#091522] px-5 py-3 border-b border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Truck className="w-3.5 h-3.5 text-[#FFD21F]" />
                {freeShippingRemaining > 0 ? (
                  <span>
                    Add <span className="text-[#FFD21F] font-bold font-mono">£{freeShippingRemaining.toFixed(2)}</span> for <strong className="text-white">FREE UK DELIVERY</strong>
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold">
                    You unlocked FREE UK Standard Delivery!
                  </span>
                )}
              </div>
              <span className="text-slate-400 font-mono text-[11px]">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#FFD21F] h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-800/80">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Your cart is empty</h3>
                  <p className="text-slate-400 text-xs max-w-xs mx-auto">
                    Your collection is waiting! Explore our 3D printed display figures, stands, and desk accessories.
                  </p>
                </div>
                <button
                  id="empty-cart-explore-btn"
                  onClick={handleContinueShopping}
                  className="px-6 py-2.5 bg-[#FFD21F] hover:bg-[#E5BC1B] text-[#071525] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <span>Explore Collectibles</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedVariant || ''}`} className="pt-4 first:pt-0 flex gap-3.5 group">
                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate(`/product/${item.product.slug}`);
                    }}
                    className="w-18 h-18 rounded-xl bg-slate-900 border border-slate-700/80 overflow-hidden shrink-0 cursor-pointer"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4
                          onClick={() => {
                            setIsCartOpen(false);
                            navigate(`/product/${item.product.slug}`);
                          }}
                          className="text-sm font-semibold text-white hover:text-[#FFD21F] cursor-pointer transition-colors truncate"
                        >
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                          className="text-slate-400 hover:text-red-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Variant: <span className="text-slate-300 font-medium">{item.selectedVariant}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-700 rounded-lg bg-[#071525]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
                          className="p-1.5 text-slate-400 hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-bold text-white min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant)}
                          className="p-1.5 text-slate-400 hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Price */}
                      <div className="text-right">
                        <div className="font-mono font-bold text-sm text-[#FFD21F]">
                          £{(item.product.price * item.quantity).toFixed(2)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            £{item.product.price.toFixed(2)} ea
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-[#071525] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-white">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Est. UK Delivery</span>
                  <span className="font-mono text-slate-300">
                    {standardShippingFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      `£${standardShippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Estimated Total</span>
                  <span className="font-mono text-base text-[#FFD21F]">£{estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  id="drawer-checkout-btn"
                  onClick={handleCheckoutClick}
                  className="w-full py-3 px-4 rounded-xl bg-[#FFD21F] hover:bg-[#E5BC1B] text-[#071525] font-extrabold text-sm uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="drawer-continue-shopping-btn"
                  onClick={handleContinueShopping}
                  className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

              <div className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Guest Checkout • No Account Required</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
