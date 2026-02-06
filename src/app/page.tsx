import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle2, ShoppingBag, Smartphone, Zap, Lock, TrendingUp, Users, Download, Key, Eye } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8 border border-white/20">
                            <Zap className="w-4 h-4" />
                            <span>Launch Your Online Store in Minutes</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-lg">
                            Sell Anything Online
                            <br />
                            <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                                The Smart Way
                            </span>
                        </h1>

                        <p className="mt-6 max-w-3xl mx-auto text-xl text-purple-100 mb-12 leading-relaxed">
                            Create your online store and sell digital products (ebooks, courses, templates) or physical items (clothing, accessories, gadgets).
                            Accept payments via Paystack and manage orders seamlessly.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                            <Link href="/register">
                                <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 px-10 text-lg h-14 rounded-full shadow-2xl hover:shadow-xl transition-all hover:scale-105">
                                    Start Selling Free
                                </Button>
                            </Link>
                            <Link href="/explore">
                                <Button variant="outline" size="lg" className="bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm px-10 text-lg h-14 rounded-full">
                                    Browse Stores
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-300" />
                                <span>No Setup Fees</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-300" />
                                <span>Instant Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-300" />
                                <span>Secure Payments</span>
                            </div>
                        </div>
                    </div>

                    {/* Wave Divider */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white" />
                        </svg>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Sell Online</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Built for creators and entrepreneurs who want to sell digital products or physical goods online
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="group p-8 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Download className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Downloads</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Customers get instant access to download files immediately after payment. Perfect for ebooks, templates, and digital assets.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="group p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Key className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Access Key Delivery</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Share secure access keys for courses, memberships, or exclusive content. Control who gets access to your premium materials.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="group p-8 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Eye className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">View-Only Mode</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Protect your PDFs with secure view-only access. Customers can read but can't download, copy, or share your content.
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="group p-8 bg-gradient-to-br from-yellow-50 to-white rounded-2xl border border-yellow-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Smartphone className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">WhatsApp Integration</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Let customers contact you directly via WhatsApp. Share your products easily with built-in WhatsApp sharing buttons.
                                </p>
                            </div>

                            {/* Feature 5 */}
                            <div className="group p-8 bg-gradient-to-br from-pink-50 to-white rounded-2xl border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Lock className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Payments</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Accept payments safely via Paystack. Support for bank transfers, cards, and USSD. Get paid directly to your Nigerian bank account.
                                </p>
                            </div>

                            {/* Feature 6 */}
                            <div className="group p-8 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Sales Dashboard</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Track your revenue, orders, and product performance in real-time. Make data-driven decisions to grow your business.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Start Selling in 3 Simple Steps</h2>
                            <p className="text-xl text-gray-600">No technical skills required. Get your store live in minutes.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                                    1
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Create Your Account</h3>
                                <p className="text-gray-600">
                                    Sign up for free and set up your store profile. Choose your unique store username.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                                    2
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Your Products</h3>
                                <p className="text-gray-600">
                                    Add your digital products, set prices, and choose how you want to deliver them to customers.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                                    3
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Start Earning</h3>
                                <p className="text-gray-600">
                                    Share your store link and start making sales. We handle payments and delivery automatically.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Digital Business?</h2>
                        <p className="text-xl text-purple-100 mb-10 leading-relaxed">
                            Join creators and entrepreneurs who are already earning by selling their products online.
                            No monthly fees, no hidden charges. We only succeed when you succeed.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                            <Link href="/register">
                                <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 px-12 text-xl h-16 rounded-full shadow-2xl hover:shadow-xl transition-all hover:scale-105">
                                    Create Free Store
                                </Button>
                            </Link>
                        </div>

                        <div className="flex flex-wrap justify-center gap-8 text-purple-100">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-300" />
                                <span>Free Forever</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-300" />
                                <span>No Credit Card Required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-300" />
                                <span>Setup in 5 Minutes</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
