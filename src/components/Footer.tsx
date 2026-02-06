import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-gray-50 border-t">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">V</span>
                            </div>
                            <span className="font-bold text-xl text-gray-900">Vantage</span>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs">
                            The easiest way for Nigerian creators to sell products online.
                            Integrated with WhatsApp and Paystack for seamless transactions.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
                        <ul className="mt-4 space-y-4">
                            <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Features</Link></li>
                            <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Pricing</Link></li>
                            <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Showcase</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                        <ul className="mt-4 space-y-4">
                            <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">About</Link></li>
                            <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Blog</Link></li>
                            <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Contact</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-8 flex items-center justify-between">
                    <p className="text-base text-gray-400">&copy; 2026 Vantage. All rights reserved.</p>
                    <div className="flex space-x-6">
                        {/* Social Icons Placeholder */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
