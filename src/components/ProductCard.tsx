import React from 'react';
import { Star, Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const { navigate } = useRouter();
  const wishlisted = isWishlisted(product.id);
  const [justAdded, setJustAdded] = React.useState(false);

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      id={`product-card-${product.slug}`}
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square bg-[#F1F5F9] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-sm">
              Sale
            </span>
          )}
          {product.newRelease && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-[#071525] text-[#FFD21F] border border-[#FFD21F]/30 shadow-sm">
              Fresh Print
            </span>
          )}
          {product.bestSeller && !product.newRelease && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-amber-500 text-slate-900 shadow-sm">
              Fan Fav
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            wishlisted
              ? 'bg-rose-50 text-rose-600 shadow-md'
              : 'bg-white/80 hover:bg-white text-slate-500 hover:text-rose-600 shadow-sm'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* 3D Print Material Pill */}
        <div className="absolute bottom-2.5 left-2.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <span className="px-2 py-0.5 rounded bg-[#071525]/75 backdrop-blur-sm text-slate-200 text-[10px] font-mono tracking-tight border border-white/10">
            3D Print • {product.height}
          </span>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="capitalize font-medium text-slate-500">
              {product.category.replace('-', ' & ')}
            </span>
            <div className="flex items-center gap-1 text-slate-700">
              <Star className="w-3.5 h-3.5 fill-[#FFD21F] text-[#FFD21F]" />
              <span className="font-bold text-slate-800 text-[11px]">{product.rating.toFixed(1)}</span>
              <span className="text-slate-400 text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-display font-bold text-slate-900 text-base sm:text-lg group-hover:text-[#0D1B2A] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-slate-600 line-clamp-1 mt-1 font-normal">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono font-extrabold text-lg sm:text-xl text-[#071525]">
                £{product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="font-mono text-xs text-slate-400 line-through">
                  £{product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              In Stock
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 shadow-sm ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#071525] hover:bg-[#FFD21F] text-white hover:text-[#071525]'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
