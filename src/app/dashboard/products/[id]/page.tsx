"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { UploadCloud, Image as ImageIcon, FileText, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('0');
    const [description, setDescription] = useState('');
    const [productType, setProductType] = useState<'digital' | 'physical'>('digital');
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(null);

    // Files (for new uploads)
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [digitalFile, setDigitalFile] = useState<File | null>(null);

    const [status, setStatus] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Fetch existing product data
    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;

            setStatus('Fetching product details...');
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();

            if (error) {
                console.error("Error fetching product:", error);
                setErrorMsg("Product not found or access denied.");
                setLoading(false);
                return;
            }

            if (data) {
                setName(data.name);
                setPrice(data.price.toString());
                setDescription(data.description || '');
                setCurrentImageUrl(data.image_url);
                setCurrentFileUrl(data.file_url);
                setStock(data.stock ? data.stock.toString() : '0');

                // Infer type: if it has stock or no file_url but isn't explicitly digital, call it physical?
                // Or maybe we need a type column in DB. For now, we can check stock > 0
                // Wait, your create logic saves stock=0 if digital. 
                // Let's assume logical default. If it has a file_url, it's digital.
                if (data.file_url) {
                    setProductType('digital');
                } else if (data.stock !== null && data.stock !== 0) {
                    setProductType('physical');
                } else {
                    // Default fallback
                    setProductType('digital');
                }
            }
            setLoading(false);
        };

        fetchProduct();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg(null);
        setStatus('Starting update...');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("You must be logged in.");

            // 1. Upload New Cover Image (if changed)
            let imageUrl = currentImageUrl;
            if (coverImage) {
                setStatus('Uploading new cover image...');
                const fileExt = coverImage.name.split('.').pop();
                const fileName = `cover_${Date.now()}.${fileExt}`;
                const { data: imgData, error: imgError } = await supabase.storage
                    .from('products')
                    .upload(`${user.id}/${fileName}`, coverImage, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (imgError) throw new Error("Failed to upload new cover: " + imgError.message);

                const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(imgData.path);
                imageUrl = publicUrl;
            }

            // 2. Upload New Digital File (if changed)
            let fileUrl = currentFileUrl;
            if (productType === 'digital' && digitalFile) {
                setStatus('Uploading new digital file...');
                const fileExt = digitalFile.name.split('.').pop();
                const fileName = `file_${Date.now()}.${fileExt}`;
                const { data: fileData, error: fileError } = await supabase.storage
                    .from('products')
                    .upload(`${user.id}/${fileName}`, digitalFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (fileError) throw new Error("Failed to upload new file: " + fileError.message);

                const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileData.path);
                fileUrl = publicUrl;
            }

            // 3. Update Database
            setStatus('Updating product...');
            const { error } = await supabase
                .from('products')
                .update({
                    name,
                    price: parseFloat(price),
                    description,
                    image_url: imageUrl,
                    file_url: fileUrl,
                    stock: productType === 'physical' ? parseInt(stock) : 0
                })
                .eq('id', productId)
                .eq('user_id', user.id); // Security check

            if (error) throw error;

            setStatus('Done!');
            alert('Product Updated Successfully!');
            router.push('/dashboard/products');

        } catch (error: any) {
            console.error("Update Error:", error);
            setErrorMsg(error.message || "An error occurred.");
        } finally {
            setSubmitting(false);
            setStatus('');
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading product...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <Link href="/dashboard/products" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-2">
                        <ChevronLeft className="w-4 h-4" /> Back to Products
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Product Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-gray-900"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary h-32 transition resize-none text-gray-900"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₦)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">₦</span>
                                <input
                                    type="number"
                                    required
                                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-gray-900"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stock Card (Physical Only) */}
                    {productType === 'physical' && (
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">Inventory</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-gray-900"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Media & Type */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Product Type</h2>
                        <div className="space-y-2">
                            <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${productType === 'digital' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                                <input type="radio" name="type" className="h-4 w-4 text-primary" checked={productType === 'digital'} onChange={() => setProductType('digital')} />
                                <span className="ml-3 flex-1 text-sm font-medium text-gray-900">Digital Product</span>
                                <FileText className="w-5 h-5 text-gray-400" />
                            </label>

                            <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${productType === 'physical' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                                <input type="radio" name="type" className="h-4 w-4 text-primary" checked={productType === 'physical'} onChange={() => setProductType('physical')} />
                                <span className="ml-3 flex-1 text-sm font-medium text-gray-900">Physical Product</span>
                                <Package className="w-5 h-5 text-gray-400" />
                            </label>
                        </div>
                    </div>

                    {/* Media Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900">Product Media</h2>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                            {/* Existing Image Preview */}
                            {currentImageUrl && !coverImage && (
                                <div className="mb-3 relative rounded-lg border border-gray-200 overflow-hidden h-32 w-full bg-gray-100">
                                    <img src={currentImageUrl} alt="Current Cover" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                                        <p className="text-white text-xs">Current Image</p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition relative">
                                <div className="space-y-1 text-center">
                                    {coverImage ? (
                                        <div className="flex flex-col items-center">
                                            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                                            <p className="text-sm text-green-600 font-medium">{coverImage.name}</p>
                                            <button type="button" onClick={() => setCoverImage(null)} className="text-xs text-red-500 underline mt-2">Remove</button>
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                                                    <span>Change Cover</span>
                                                    <input type="file" className="sr-only" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} />
                                                </label>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Digital File */}
                        {productType === 'digital' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Digital File</label>
                                {currentFileUrl && !digitalFile && (
                                    <div className="mb-2 p-2 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100">
                                        Current file uploaded. Uploading a new one will replace it.
                                    </div>
                                )}
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition bg-blue-50/50 border-blue-200">
                                    <div className="space-y-1 text-center">
                                        {digitalFile ? (
                                            <div className="flex flex-col items-center">
                                                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                                                <p className="text-sm text-green-600 font-medium">{digitalFile.name}</p>
                                                <button type="button" onClick={() => setDigitalFile(null)} className="text-xs text-red-500 underline mt-2">Remove</button>
                                            </div>
                                        ) : (
                                            <>
                                                <UploadCloud className="mx-auto h-12 w-12 text-blue-400" />
                                                <div className="flex text-sm text-gray-600 justify-center">
                                                    <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                                                        <span>Change File</span>
                                                        <input type="file" className="sr-only" onChange={(e) => setDigitalFile(e.target.files?.[0] || null)} />
                                                    </label>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                    <div className="lg:col-span-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        <p className="font-bold">Error</p>
                        <p className="text-sm">{errorMsg}</p>
                    </div>
                )}

                {/* Submit Action */}
                <div className="lg:col-span-3">
                    <Button type="submit" size="lg" className="w-full text-lg h-12 shadow-lg hover:shadow-xl transition-all" disabled={submitting}>
                        {submitting ? status || 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

function Package(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m7.5 4.27 9 5.15" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22v-9" />
        </svg>
    )
}
