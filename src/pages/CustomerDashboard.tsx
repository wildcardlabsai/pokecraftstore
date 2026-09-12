import React, { useEffect, useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Heart, Settings, LogOut, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <div className="w-12 h-12 bg-[#FFD21F] rounded-full flex items-center justify-center text-xl font-bold text-slate-900 mb-4 shadow-sm">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-bold text-slate-900 truncate">{user.email}</h2>
              <p className="text-sm text-slate-500 capitalize">{user.role} Account</p>
            </div>
            
            <nav className="p-2 space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Package className="w-5 h-5 mr-3 text-slate-400" />
                My Orders
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Settings className="w-5 h-5 mr-3 text-slate-400" />
                Settings
              </button>
            </nav>
            
            <div className="p-2 border-t border-slate-200 mt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3 text-red-500" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-6">Order History</h3>
                
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">You haven't placed any orders yet.</p>
                  <button onClick={() => navigate('/shop')} className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                    Start Shopping
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-6">Account Settings</h3>
                
                <form className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" disabled value={user.email} className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Shipping Address</label>
                    <textarea className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none" rows={3} placeholder="Enter your default shipping address..."></textarea>
                  </div>
                  <button type="button" className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                    Save Changes
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};
