import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, PlacedOrder } from '../types';

interface ToastItem {
  id: string;
  message: string;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariant?: string) => void;
  removeFromCart: (productId: string, selectedVariant?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariant?: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  freeShippingProgress: number;
  standardShippingFee: number;
  expressShippingFee: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toasts: ToastItem[];
  removeToast: (id: string) => void;
  showToast: (message: string, image?: string) => void;
  lastOrder: PlacedOrder | null;
  setLastOrder: (order: PlacedOrder | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const CART_STORAGE_KEY = 'pokecraft_cart_v1';
const WISHLIST_STORAGE_KEY = 'pokecraft_wishlist_v1';
const ORDER_STORAGE_KEY = 'pokecraft_last_order_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(() => {
    try {
      const saved = localStorage.getItem(ORDER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (lastOrder) {
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(lastOrder));
      }
    } catch {
      // ignore
    }
  }, [lastOrder]);

  const showToast = (message: string, image?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, image }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, quantity = 1, selectedVariant?: string) => {
    const variant = selectedVariant || (product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
    
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === variant
      );

      if (existingIndex > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIndex] = {
          ...nextCart[existingIndex],
          quantity: nextCart[existingIndex].quantity + quantity,
        };
        return nextCart;
      } else {
        return [...prevCart, { product, quantity, selectedVariant: variant }];
      }
    });

    showToast(`${product.name} added to cart.`, product.images[0]);
  };

  const removeFromCart = (productId: string, selectedVariant?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedVariant === selectedVariant)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, selectedVariant?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedVariant === selectedVariant) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from saved items.');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wishlist!');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const freeShippingThreshold = 50.0;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const standardShippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 3.99;
  const expressShippingFee = 6.99;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        freeShippingThreshold,
        freeShippingRemaining,
        freeShippingProgress,
        standardShippingFee,
        expressShippingFee,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        toasts,
        removeToast,
        showToast,
        lastOrder,
        setLastOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
