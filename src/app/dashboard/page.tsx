"use client";

import { CreditCard, DollarSign, Package, TrendingUp, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        salesToday: 0,
        activeProducts: 0,
        storeViews: 0,
        revenueGrowth: 0
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get all orders for this seller
            const { data: orders } = await supabase
                .from('orders')
                .select('*, products(name)')
                .eq('seller_id', user.id)
                .order('created_at', { ascending: false });

            // Calculate total revenue
            const totalRevenue = orders?.reduce((sum, order) => sum + order.amount, 0) || 0;

            // Calculate today's sales
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const salesToday = orders?.filter(order => {
                const orderDate = new Date(order.created_at);
                return orderDate >= today;
            }).reduce((sum, order) => sum + order.amount, 0) || 0;

            // Get active products count
            const { count: productCount } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_active', true);

            // For store views, we'll use a placeholder since we don't track this yet
            // In a real app, you'd track page views in a separate analytics table
            const storeViews = 0;

            // Calculate revenue growth (comparing this month to last month)
            const thisMonth = new Date();
            thisMonth.setDate(1);
            thisMonth.setHours(0, 0, 0, 0);

            const lastMonth = new Date(thisMonth);
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            const thisMonthRevenue = orders?.filter(order => {
                const orderDate = new Date(order.created_at);
                return orderDate >= thisMonth;
            }).reduce((sum, order) => sum + order.amount, 0) || 0;

            const lastMonthRevenue = orders?.filter(order => {
                const orderDate = new Date(order.created_at);
                return orderDate >= lastMonth && orderDate < thisMonth;
            }).reduce((sum, order) => sum + order.amount, 0) || 0;

            const revenueGrowth = lastMonthRevenue > 0
                ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
                : 0;

            setStats({
                totalRevenue,
                salesToday,
                activeProducts: productCount || 0,
                storeViews,
                revenueGrowth
            });

            setRecentOrders(orders?.slice(0, 5) || []);
            setLoading(false);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Card 1: Total Revenue */}
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <div className="p-2 bg-green-50 rounded-full">
                            <DollarSign className="w-4 h-4 text-green-600" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                            ₦ {stats.totalRevenue.toLocaleString()}
                        </h3>
                        {stats.revenueGrowth !== 0 && (
                            <span className={`text-xs font-medium flex items-center ${stats.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {stats.revenueGrowth > 0 ? '+' : ''}{stats.revenueGrowth.toFixed(1)}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Card 2: Sales Today */}
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-gray-500">Sales Today</p>
                        <div className="p-2 bg-blue-50 rounded-full">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        ₦ {stats.salesToday.toLocaleString()}
                    </h3>
                </div>

                {/* Card 3: Active Products */}
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-gray-500">Active Products</p>
                        <div className="p-2 bg-purple-50 rounded-full">
                            <Package className="w-4 h-4 text-purple-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.activeProducts}</h3>
                </div>

                {/* Card 4: Store Views */}
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-gray-500">Store Views</p>
                        <div className="p-2 bg-orange-50 rounded-full">
                            <Eye className="w-4 h-4 text-orange-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {stats.storeViews > 0 ? stats.storeViews.toLocaleString() : 'Coming Soon'}
                    </h3>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center md:text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3">Order ID</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-gray-600">#{order.reference}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{order.customer_name}</td>
                                        <td className="px-6 py-4 text-gray-600">{order.products?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-900">₦ {order.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : order.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No transactions yet. Start selling to see your orders here!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
