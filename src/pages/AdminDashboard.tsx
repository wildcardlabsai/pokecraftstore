import React, { useEffect, useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Search, Plus, TrendingUp } from 'lucide-react';
import { Product } from '../types';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      setProducts(prodData);
      
      const orderRes = await fetch('/api/admin/orders');
      const orderData = await orderRes.json();
      setOrders(orderData);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-display font-bold text-white tracking-tight">Admin Area</h2>
          <p className="text-xs text-slate-500 mt-1">{user.email}</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3 text-slate-400" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-white'}`}
          >
            <Package className="w-5 h-5 mr-3 text-slate-400" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-white'}`}
          >
            <ShoppingBag className="w-5 h-5 mr-3 text-slate-400" />
            Orders
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900 capitalize">{activeTab}</h1>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center text-slate-500 mb-4">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    <h3 className="text-sm font-medium">Total Revenue</h3>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">£1,240.00</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center text-slate-500 mb-4">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    <h3 className="text-sm font-medium">Total Orders</h3>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{orders.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center text-slate-500 mb-4">
                    <Package className="w-5 h-5 mr-2" />
                    <h3 className="text-sm font-medium">Active Products</h3>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{products.length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-900">Manage Products</h3>
                <button className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                      <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                      <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                      <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-6 flex items-center">
                          <img src={product.images[0]} alt="" className="w-10 h-10 rounded object-cover border border-slate-200 mr-3" />
                          <span className="font-medium text-slate-900">{product.name}</span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-500 capitalize">{product.category}</td>
                        <td className="py-4 px-6 text-sm text-slate-900 font-medium">£{product.price.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                            {product.stock} in stock
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-900">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                {orders.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    No orders placed yet.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {orders.map((order, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6 font-medium text-slate-900">{order.id}</td>
                          <td className="py-4 px-6 text-sm text-slate-500">{new Date(order.date).toLocaleDateString()}</td>
                          <td className="py-4 px-6 text-sm text-slate-900">{order.email || 'Guest'}</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-slate-900">
                            £{order.total?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
