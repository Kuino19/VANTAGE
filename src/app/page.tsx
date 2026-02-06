import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle2, ShoppingBag, Smartphone, Zap } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 bg-gray-50">
                    <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                        <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
                            Sell on <span className="text-primary">WhatsApp</span> like a Pro.
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-10">
                            The all-in-one platform for Nigerian creators to sell digital products, ebooks, and services.
                            Accept payments via Paystack and deliver files automatically.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/register">
                                <Button size="lg" className="px-8 text-lg h-14 rounded-full">Start Selling for Free</Button>
                            </Link>
                            <Link href="/explore">
                                <Button variant="outline" size="lg" className="px-8 text-lg h-14 rounded-full border-gray-300">
                                    Explore Store
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Value Props / Features */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900">Why Top Creators Choose Vantage</h2>
                            <p className="mt-4 text-gray-500">Everything you need to turn your audience into customers.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {/* Feature 1 */}
                            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                                    <Smartphone className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">WhatsApp Automation</h3>
                                <p className="text-gray-600">
                                    Automate the "DM for price" conversation. Buttons that link directly to your WhatsApp with pre-filled order details.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                    <Zap className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Delivery</h3>
                                <p className="text-gray-600">
                                    Selling an ebook or course? We instantly email the file to your customer after payment. You sleep, you earn.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                                    <ShoppingBag className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Local Payments</h3>
                                <p className="text-gray-600">
                                    Accept payments via Bank Transfer, USSD, and Card using Paystack. Get settled in your Nigerian bank account the next day.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trust Section */}
                <section className="py-20 bg-gray-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-8 md:mb-0">
                            <h2 className="text-3xl font-bold mb-4">Ready to monetize your knowledge?</h2>
                            <p className="text-gray-400 max-w-md">Join over 5,000 Nigerian creators earning millions selling digital products.</p>
                        </div>
                        <div className="flex gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-1">₦500M+</div>
                                <div className="text-sm text-gray-400">Processed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-1">5k+</div>
                                <div className="text-sm text-gray-400">Creators</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-white text-center">
                    <div className="max-w-3xl mx-auto px-4">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Start your free store today</h2>
                        <p className="text-xl text-gray-500 mb-8">No monthly fees. We only make money when you make a sale.</p>

                        <div className="flex flex-col items-center gap-4">
                            <Link href="/dashboard/products/new">
                                <Button size="lg" className="h-16 px-10 text-xl rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                    Create My Account
                                </Button>
                            </Link>
                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" /> No credit card required
                            </p>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
