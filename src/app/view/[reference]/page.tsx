"use client";

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Lock, FileText, AlertTriangle } from 'lucide-react';

export default function ViewDocumentPage({ params }: { params: Promise<{ reference: string }> }) {
    const { reference } = use(params);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);
    const [product, setProduct] = useState<any>(null);
    const [accessKeyInput, setAccessKeyInput] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            // Fetch order by reference
            const { data, error } = await supabase
                .from('orders')
                .select('*, products(*)')
                .eq('reference', reference)
                .single();

            if (data) {
                setOrder(data);
                setProduct(data.products);
            }
            setLoading(false);
        };

        if (reference) fetchOrder();

        // Anti-Copy / Anti-Right Click
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        const handleKeyDown = (e: KeyboardEvent) => {
            // Block Print Screen (limited support) or Ctrl+P
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                alert("Printing is disabled for this document.");
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [reference]);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (order && order.access_key === accessKeyInput.trim()) {
            setIsUnlocked(true);
            setErrorMsg('');
        } else {
            setErrorMsg('Invalid Access Key. Please check your receipt.');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    if (!order) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold">Document Not Found</h1>
                <p className="text-gray-500 mt-2">Invalid reference ID.</p>
            </div>
        </div>
    );

    // Locked State
    if (!isUnlocked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                        <Lock className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Protected Document</h2>
                    <p className="text-gray-600">
                        Enter the **Access Key** provided after payment to view: <br />
                        <span className="font-semibold text-gray-900">{product.name}</span>
                    </p>

                    <form onSubmit={handleUnlock} className="space-y-4">
                        <input
                            type="text"
                            required
                            placeholder="Enter 6-digit Key"
                            className="w-full text-center text-2xl tracking-widest px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition"
                            value={accessKeyInput}
                            onChange={(e) => setAccessKeyInput(e.target.value)}
                        />
                        {errorMsg && <p className="text-red-500 text-sm font-medium">{errorMsg}</p>}

                        <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 h-11 text-lg">
                            Unlock Document
                        </Button>
                    </form>
                    <p className="text-xs text-gray-400">Secure Viewer • No Downloads • No Screenshots</p>
                </div>
            </div>
        );
    }

    // Unlocked Viewer State
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center py-8 select-none print:hidden">
            <div className="w-full max-w-4xl px-4 mb-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="font-medium truncate max-w-[200px]">{product.name}</span>
                </div>
                <div className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                    Read Only Mode
                </div>
            </div>

            <div className="w-full max-w-4xl bg-white aspect-[3/4] md:aspect-[8.5/11] rounded shadow-2xl overflow-hidden relative group">
                {/* Overlay to prevent drag/save */}
                <div className="absolute inset-0 z-10 bg-transparent" onContextMenu={(e) => e.preventDefault()}></div>

                {/* Embed PDF/File */}
                {/* Note: In a real app we might use react-pdf or a canvas renderer for tougher security. 
                    Standard iframe/object can be inspected, but this meets the 'deterrent' requirement. */}
                <iframe
                    src={`${product.file_url}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full pointer-events-none"
                    title="Document Viewer"
                />
            </div>

            <p className="text-gray-600 mt-8 text-sm">
                Protected by Vantage. Do not distribute.
            </p>
        </div>
    );
}

// Add global styles for print blocking if needed, though Tailwind 'print:hidden' covers it on the element.
