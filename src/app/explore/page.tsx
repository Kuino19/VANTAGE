"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, Filter, Star, Package } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["All", "E-books", "Courses", "Templates", "Music", "Physical", "Services"];

export default function ExplorePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch products with profile data
                // Note: We need to manually join or fetch related data differently if we don't have FK set up strictly for PostgREST joins
                // But generally: .select('*, profiles(full_name, username)') works if foreign keys exist.
                // Let's check schema: products.user_id references auth.users. profiles.id references auth.users.
                // There isn't a direct FK from products.user_id to profiles.id in SQL, but they share the key.
                // Supabase might not auto-detect this one-to-one strictly for joins unless we defined it.
                // WORKAROUND: We can just fetch products and then fetch profiles, OR define the relationship.
                // Let's try simple fetch first, then a client-side map for MVP speed if valid relation is missing.

                const { data: productsData, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (!productsData) {
                    setProducts([]);
                    return;
                }

                // Fetch profiles for these products
                const userIds = [...new Set(productsData.map(p => p.user_id))];
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, full_name, username')
                    .in('id', userIds);

                // Merge data
                const mergedProducts = productsData.map(product => {
                    const profile = profilesData?.find(p => p.id === product.user_id);
                    return {
                        ...product,
                        author: profile?.full_name || 'Unknown Seller',
                        username: profile?.username || 'user',
                        // Infer category roughly or default
                        category: product.file_url ? 'E-books' : (product.stock !== undefined ? 'Physical' : 'All') // Simple heuristic
                    };
                });

                setProducts(mergedProducts);
            } catch (err) {
                console.error("Error loading products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        // Simple heuristic for category matching
        let matchesCategory = true;
        if (activeCategory === "Physical") {
            matchesCategory = product.stock !== undefined && product.stock !== null; // It has stock?
            // Actually my heuristic above maps it.
            matchesCategory = product.category === "Physical"; // Use mapped category
        } else if (activeCategory === "E-books" || activeCategory === "Courses" || activeCategory === "Templates") {
            matchesCategory = product.file_url !== null; // Digital
            // If we really want strict categories, we need a column in DB. For now, treat all digital as 'E-books/Digital'
            if (activeCategory === "E-books" && product.file_url) matchesCategory = true;
            else if (product.file_url) matchesCategory = true; // Show all digital for any digital tag for now
            else matchesCategory = false;
        } else if (activeCategory !== "All") {
            matchesCategory = false; // Unknown category
        }

        // Relaxed category logic for MVP:
        if (activeCategory === "All") matchesCategory = true;

        const matchesSearch = (product.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (product.author?.toLowerCase() || "").includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Header / Search Section */}
            <div className="bg-white border-b sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore Marketplace</h1>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                                placeholder="Search for products, creators, or services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="flex items-center gap-2 h-12">
                            <Filter className="w-4 h-4" />
                            Filters
                        </Button>
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === category
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500">Loading marketplace...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                        <Button
                            variant="link"
                            className="mt-2 text-primary"
                            onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product) => (
                            <Link href={`/product/${product.id}`} key={product.id} className="group block">
                                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                                    {/* Image */}
                                    <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                <Package className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold text-gray-900">
                                            {product.category}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-500">{product.author}</span>
                                            {/* Rating Placeholder - Hardcoded for MVP as we don't have reviews yet */}
                                            <div className="flex items-center text-yellow-500 text-xs font-bold">
                                                <Star className="w-3 h-3 fill-current mr-1" />
                                                5.0 <span className="text-gray-400 font-normal ml-1">(New)</span>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-xl font-bold text-gray-900">
                                                ₦{product.price.toLocaleString()}
                                            </span>
                                            <span className="text-primary text-sm font-semibold group-hover:underline">
                                                View Details
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
