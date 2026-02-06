"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Share2, MessageCircle, ShoppingBag, Sparkles } from "lucide-react";
import { getWhatsAppShareLink } from "@/lib/whatsapp";
import { useEffect, useState } from "react";

export default function StorePage({ params }: { params: Promise<{ username: string }> }) {
    const [username, setUsername] = useState<string>('');
    const [profile, setProfile] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        // Unwrap params promise
        params.then(({ username: user }) => {
            setUsername(user);
            loadStoreData(user);
        });
    }, [params]);

    const loadStoreData = async (user: string) => {
        setLoading(true);

        // 1. Get Profile (Store info)
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', user)
            .single();

        if (profileError || !profileData) {
            setNotFound(true);
            setLoading(false);
            return;
        }

        setProfile(profileData);

        // 2. Get Products for this user
        const { data: productsData } = await supabase
            .from('products')
            .select('*')
            .eq('user_id', profileData.id)
            .eq('is_active', true);

        setProducts(productsData || []);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading store...</p>
                </div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
                <div className="text-center px-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Store Not Found</h1>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">The store you're looking for doesn't exist or has been removed.</p>
                    <Link href="/explore">
                        <Button size="lg" className="rounded-full px-8">Explore Other Stores</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const initials = profile?.full_name
        ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : username[0]?.toUpperCase() || 'S';

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Hero Section with Gradient */}
            <div className="relative overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <div className="text-center">
                        {/* Profile Avatar with Glow */}
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-50"></div>
                            <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-white text-purple-600 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold shadow-2xl border-4 border-white/50">
                                {initials}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        {/* Store Name & Username */}
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                            @{username}
                        </h1>
                        <p className="text-purple-100 text-lg mb-2">{profile?.full_name}</p>

                        {/* Bio */}
                        {profile.bio && (
                            <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
                                {profile.bio}
                            </p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap justify-center gap-4 mt-8">
                            <a
                                href={profile.whatsapp_number ? `https://wa.me/${profile.whatsapp_number}` : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 rounded-full px-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Contact Seller
                                </Button>
                            </a>
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm rounded-full px-8 shadow-xl"
                                onClick={() => {
                                    const shareUrl = getWhatsAppShareLink(`Check out ${profile.full_name || username}'s store on Vantage! ${window.location.href}`);
                                    window.open(shareUrl, '_blank');
                                }}
                            >
                                <Share2 className="w-5 h-5 mr-2" />
                                Share Store
                            </Button>
                        </div>


                        {/* Stats */}
                        <div className="flex justify-center gap-8 mt-12 text-white/90">
                            <div className="text-center">
                                <div className="text-3xl font-bold">{products.length}</div>
                                <div className="text-sm text-white/70">Products</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="url(#paint0_linear)" fillOpacity="0.2" />
                        <path d="M0 40L60 46.7C120 53 240 67 360 70C480 73 600 67 720 63.3C840 60 960 60 1080 63.3C1200 67 1320 73 1380 76.7L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V40Z" fill="white" />
                        <defs>
                            <linearGradient id="paint0_linear" x1="720" y1="0" x2="720" y2="120" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white" />
                                <stop offset="1" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* Products Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
                        <p className="text-gray-600">Discover amazing digital products</p>
                    </div>
                    {products.length > 0 && (
                        <div className="text-sm text-gray-500">
                            {products.length} {products.length === 1 ? 'item' : 'items'}
                        </div>
                    )}
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-sm">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
                        <p className="text-gray-500">This seller hasn't added any products yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {products.map((product: any) => (
                            <Link href={`/product/${product.id}`} key={product.id} className="group">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-gray-100">
                                    {/* Product Image */}
                                    <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-blue-100 relative overflow-hidden">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-center">
                                                    <ShoppingBag className="w-16 h-16 text-purple-300 mx-auto mb-2" />
                                                    <span className="text-sm text-purple-400 font-medium">No Image</span>
                                                </div>
                                            </div>
                                        )}
                                        {/* Overlay Badge */}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-purple-600 shadow-lg">
                                            Digital
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                                            {product.name}
                                        </h3>

                                        {product.description && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {product.description}
                                            </p>
                                        )}

                                        {/* Price & CTA */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div>
                                                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                                    ₦{product.price.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                                                <span className="text-sm">View</span>
                                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                    <p className="text-gray-600 text-sm">
                        Powered by <span className="font-semibold text-purple-600">Vantage</span> •
                        <Link href="/register" className="text-purple-600 hover:text-purple-700 ml-1 font-medium">
                            Create your own store
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
