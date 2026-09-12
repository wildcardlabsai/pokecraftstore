import React from 'react';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import { PRODUCTS } from '../data/products';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose }) => {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const { navigate } = useRouter();

  if (!isOpen) return null;

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#071525]/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 bg-[#071525] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg">Your Wishlist</h2>
                <div className="text-xs text-slate-400">
                  {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'} saved
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {wishlistedProducts.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  No saved items yet
                </h3>
                <p className="text-slate-500 text-xs max-w-xs mx-auto">
                  Click the heart icon on any 3D print to keep track of items you want in your collection.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-[#071525] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#FFD21F] hover:text-[#071525] transition-colors"
                >
                  Explore Shop
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {wishlistedProducts.map((p) => (
                  <div key={p.id} className="py-4 flex gap-4 items-center">
                    <div
                      onClick={() => {
                        onClose();
                        navigate(`/product/${p.slug}`);
                      }}
                      className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 cursor-pointer"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        onClick={() => {
                          onClose();
                          navigate(`/product/${p.slug}`);
                        }}
                        className="font-display font-bold text-sm text-slate-900 hover:text-amber-600 cursor-pointer transition-colors truncate"
                      >
                        {p.name}
                      </h4>
                      <div className="font-mono font-bold text-xs text-[#071525] mt-0.5">
                        £{p.price.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-400 capitalize">
                        {p.category.replace('-', ' & ')}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          addToCart(p, 1);
                        }}
                        className="p-2 bg-[#071525] hover:bg-[#FFD21F] text-white hover:text-[#071525] rounded-xl transition-colors shadow-sm"
                        title="Move to Cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition-colors"
                        title="Remove from wishlist"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlistedProducts.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
              <button
                onClick={() => {
                  wishlistedProducts.forEach((p) => addToCart(p, 1));
                  onClose();
                }}
                className="w-full py-3.5 bg-[#071525] hover:bg-[#0D1B2A] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#FFD21F]" />
                <span>Add All to Cart</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  navigate('/shop');
                }}
                className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Continue Browsing
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
