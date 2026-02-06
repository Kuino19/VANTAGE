"use client";

import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Settings, LogOut, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [initials, setInitials] = useState("..");
    const [username, setUsername] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Fetch profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, username')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setUsername(profile.username);
                    if (profile.full_name) {
                        const nameParts = profile.full_name.split(' ');
                        const firstInitial = nameParts[0]?.[0] || '';
                        const lastInitial = nameParts[1]?.[0] || '';
                        setInitials((firstInitial + lastInitial).toUpperCase());
                    } else {
                        setInitials(user.email ? user.email.slice(0, 2).toUpperCase() : "??");
                    }
                }
            }
        };

        getProfile();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login"); // Redirect to login
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">V</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Vantage</h2>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg group">
                        <LayoutDashboard className="w-5 h-5 text-gray-500 group-hover:text-primary transition" />
                        Overview
                    </Link>
                    <Link href="/dashboard/products" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg group transition">
                        <Package className="w-5 h-5 text-gray-400 group-hover:text-primary transition" />
                        Products
                    </Link>
                    <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg group transition">
                        <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-primary transition" />
                        Orders
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg group transition">
                        <Settings className="w-5 h-5 text-gray-400 group-hover:text-primary transition" />
                        Settings
                    </Link>
                    {username && (
                        <Link href={`/${username}`} target="_blank" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg group transition mt-4 border border-blue-100">
                            <span className="w-5 h-5 flex items-center justify-center font-bold border border-blue-200 rounded text-xs">↗</span>
                            View My Store
                        </Link>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition">
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:ml-64">
                <header className="flex justify-between items-center py-4 px-6 bg-white border-b border-gray-200 sticky top-0 z-10 opacity-95 backdrop-blur">
                    <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-sm font-bold text-green-700">
                            {initials}
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
