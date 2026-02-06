"use client";

import { useEffect, useState, use } from 'react';
import { Button } from '@/components/ui/button';
import { getBuyMessage, getWhatsAppLink } from '@/lib/whatsapp';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import { Package } from 'lucide-react';

const PaystackButton = dynamic(() => import('@/components/PaystackButton'), { ssr: false });

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    // Note: params.slug is actually the ID based on current routing logic
    const { slug: productId } = use(params);

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentRef, setPaymentRef] = useState("");
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();

            if (data) {
                // Fetch seller info
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.user_id)
                    .single();

                setProduct({
                    ...data,
                    sellerName: profile?.full_name || 'Vantage Seller',
                    sellerPhone: profile?.phone || ''
                });
            }
            setLoading(false);
        };

        if (productId) fetchProduct();
    }, [productId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p>Product not found.</p>
            </div>
        );
    }

    const whatsappUrl = product.sellerPhone
        ? getWhatsAppLink(
            product.sellerPhone,
            getBuyMessage(product.name, typeof window !== 'undefined' ? window.location.href : '')
        )
        : '#';

    const handleSuccess = async (reference: any) => {
        setPaymentRef(reference.reference);
        setPaymentSuccess(true);

        let generatedKey = null;
        // Generate a 6-digit key for View Only access
        if (product.delivery_type === 'view_only') {
            generatedKey = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedKey(generatedKey);
        }

        try {
            const { error } = await supabase
                .from('orders')
                .insert([
                    {
                        product_id: productId,
                        seller_id: product.user_id,
                        buyer_email: email,
                        amount: product.price,
                        reference: reference.reference,
                        status: 'paid',
                        access_key: generatedKey // Save the generated key
                    }
                ]);

            if (error) {
                console.error("Failed to save order:", error);
            }
        } catch (err) {
            console.error("Order save error:", err);
        }
    };

    const handleClose = () => {
        console.log("Payment closed");
    };

    if (paymentSuccess) {
        const receiptMessage = `Hello, here is my payment receipt for ${product.name}.\nReference: ${paymentRef}\nAmount: ₦${product.price}`;
        const receiptWhatsappUrl = product.sellerPhone ? getWhatsAppLink(product.sellerPhone, receiptMessage) : '#';

        // ORDER ID or KEY lookup would be needed for the link, but since we just have the ref in state,
        // we might ideally need the inserted order ID.
        // For local state simplicity in this MVP, we assume the user stays on the page or checks their email (if we had email).
        // BUT for 'view_only', we need them to know the key.
        // We will display the key directly here.

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
                    <p className="text-gray-600">
                        Thank you for purchasing <strong>{product.name}</strong>.
                    </p>

                    {/* === DELIVERY SECTION === */}

                    {/* 1. Direct Download */}
                    {product.delivery_type === 'download' && product.file_url && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                            <p className="text-sm text-blue-800 mb-3">Your digital product is ready.</p>
                            <a href={product.file_url} download target="_blank" rel="noopener noreferrer">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-10 gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    Download Now
                                </Button>
                            </a>
                        </div>
                    )}

                    {/* 2. Key Access (Static) */}
                    {product.delivery_type === 'key_access' && product.delivery_key && (
                        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-4 text-left">
                            <p className="text-sm text-purple-800 mb-2 font-semibold">Your Access Info:</p>
                            <div className="bg-white p-3 rounded border border-purple-200 font-mono text-sm break-all select-all">
                                {product.delivery_key}
                            </div>
                            <p className="text-xs text-purple-600 mt-2">Save this information safely.</p>
                        </div>
                    )}

                    {/* 3. View Only (Generated) */}
                    {product.delivery_type === 'view_only' && (
                        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-4 text-left">
                            <p className="text-sm text-yellow-800 mb-2 font-semibold">Access Key (Required to View):</p>
                            {/* We need to use the key we generated. Since state doesn't have it, we must retrieve or assume logic.
                                Ideally handleSuccess should set generatedKey to state.
                                For now, we unfortunately can't show it easily without state update.
                                Let's update state to hold it. */}
                            <div className="bg-white p-3 rounded border border-yellow-200 font-mono text-2xl text-center font-bold tracking-widest">
                                {/* WAIT: I need to update state to store this key to display it! 
                                    I will add 'generatedKey' to state in the replacement. */}
                                {generatedKey} {/* Fallback / Placeholder if real logic needs state update */}
                            </div>
                            <p className="text-xs text-yellow-600 mt-2 text-center">Use this key to unlock your document.</p>

                            <a href={`/view/${paymentRef}`} target="_blank" className="block mt-4">
                                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 h-10 gap-2">
                                    Read Now
                                </Button>
                            </a>
                        </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg text-left text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Amount Paid</span>
                            <span className="font-medium text-gray-900">₦{product.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Reference</span>
                            <span className="font-mono text-gray-900">{paymentRef}</span>
                        </div>
                    </div>

                    {product.sellerPhone && (
                        <a
                            href={receiptWhatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block w-full"
                        >
                            <Button className="w-full bg-green-500 hover:bg-green-600 h-12 text-lg gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                Send Receipt to Seller
                            </Button>
                        </a>
                    )}

                    <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                        Back to Product
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* Product Image Side */}
                <div className="md:w-1/2 h-64 md:h-auto bg-gray-200 relative">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            <Package className="w-16 h-16" />
                        </div>
                    )}
                </div>

                {/* Product Details Side */}
                <div className="md:w-1/2 p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-primary font-bold">
                                {product.sellerName[0]}
                            </div>
                            <span className="text-sm text-gray-600">Sold by {product.sellerName}</span>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="text-2xl font-bold text-primary mb-8">
                            ₦{product.price.toLocaleString()}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Input for Email before paying */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Enter your email address</label>
                            <input
                                type="email"
                                placeholder="example@email.com"
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Pay Button */}
                        <PaystackButton
                            amount={product.price * 100} // Convert to Kobo
                            email={email || "customer@example.com"}
                            publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ""}
                            onSuccess={handleSuccess}
                            onClose={handleClose}
                            text={`Pay ₦${product.price.toLocaleString()}`}
                        />

                        {/* OR Divider */}
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-sm">Or</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        {/* WhatsApp Chat to Buy */}
                        {product.sellerPhone && (
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                Chat to buy on WhatsApp
                            </a>
                        )}

                        <p className="text-center text-xs text-gray-400 mt-4">
                            Secured by Paystack. 100% Money Back Guarantee.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
