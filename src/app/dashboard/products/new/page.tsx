"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { getWhatsAppShareLink } from '@/lib/whatsapp';
import { UploadCloud, Image as ImageIcon, FileText, CheckCircle2 } from 'lucide-react';

export default function CreateProductPage() {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('0'); // Stock for physical products
    const [description, setDescription] = useState('');

    // Type & Delivery
    const [productType, setProductType] = useState<'digital' | 'physical'>('digital');
    const [deliveryType, setDeliveryType] = useState<'download' | 'key_access' | 'view_only'>('download');
    const [deliveryKey, setDeliveryKey] = useState(''); // For keys/links

    // Files
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [digitalFile, setDigitalFile] = useState<File | null>(null);

    const [status, setStatus] = useState<string>(''); // For granular progress updates
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        setStatus('Starting...');

        try {
            // Get Current User
            setStatus('Checking authentication...');
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("You must be logged in to create a product.");

            // 1. Upload Cover Image
            let imageUrl = null;
            if (coverImage) {
                setStatus('Uploading cover image...');
                const fileExt = coverImage.name.split('.').pop();
                const fileName = `cover_${Date.now()}.${fileExt}`;
                const { data: imgData, error: imgError } = await supabase.storage
                    .from('products')
                    .upload(`${user.id}/${fileName}`, coverImage, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (imgError) {
                    console.error("Cover Image Upload Error:", imgError);
                    throw new Error("Failed to upload cover image: " + imgError.message);
                }

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(imgData.path);
                imageUrl = publicUrl;
            }

            // 2. Upload Digital File (if applicable)
            let fileUrl = null;
            if (productType === 'digital' && digitalFile && deliveryType !== 'key_access') {
                // key_access doesn't necessarily need a file unless user wants to attach one too? 
                // Usually key_access is just key. But maybe we allow file too. Assume yes for 'download' and 'view_only'.
                // 'key_access' might just be a link/text. Let's keep logic simple: upload if present.

                setStatus('Uploading digital file...');
                const fileExt = digitalFile.name.split('.').pop();
                const fileName = `file_${Date.now()}.${fileExt}`;
                const { data: fileData, error: fileError } = await supabase.storage
                    .from('products')
                    .upload(`${user.id}/${fileName}`, digitalFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (fileError) {
                    console.error("Digital File Upload Error:", fileError);
                    throw new Error("Failed to upload digital file: " + fileError.message);
                }
                // Get Public URL
                const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileData.path);
                fileUrl = publicUrl;
            }

            // 3. Insert into Database
            setStatus('Saving product details...');
            const { error } = await supabase
                .from('products')
                .insert([
                    {
                        user_id: user.id,
                        name,
                        price: parseFloat(price),
                        description,
                        image_url: imageUrl,
                        file_url: fileUrl,
                        is_active: true,
                        stock: productType === 'physical' ? parseInt(stock) : 0,
                        delivery_type: productType === 'digital' ? deliveryType : null,
                        delivery_key: (productType === 'digital' && deliveryType === 'key_access') ? deliveryKey : null
                    },
                ]);

            if (error) {
                console.error("Database Insert Error:", error);
                throw error;
            }

            setStatus('Done!');
            alert('Product Created Successfully!');

            // Prompt to share
            const shareUrl = getWhatsAppShareLink(`Check out my new product: ${name} on Vantage!`);
            if (confirm('Do you want to share your new product on WhatsApp now?')) {
                window.open(shareUrl, '_blank');
            }

            // Reset form (simplified)
            window.location.reload();

        } catch (error: any) {
            console.error("Submission Error:", error);
            setErrorMsg(error.message || "An unknown error occurred.");
        } finally {
            setLoading(false);
            setStatus('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                    <p className="text-gray-500 text-sm">Create a product to sell on your storefront.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Product Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. The Ultimate Jollof Recipe"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                placeholder="Describe your product... what will your customers gain?"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary h-32 transition resize-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₦)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">₦</span>
                                <input
                                    type="number"
                                    required
                                    placeholder="0.00"
                                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Transaction fee: 1.5% + ₦100 (capped at ₦2,000)
                            </p>
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Track how many items you have left.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Media & Type */}
                <div className="space-y-6">

                    {/* Product Type Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Product Type</h2>
                        <div className="space-y-2">
                            <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${productType === 'digital' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                    checked={productType === 'digital'}
                                    onChange={() => setProductType('digital')}
                                />
                                <span className="ml-3 flex-1">
                                    <span className="block text-sm font-medium text-gray-900">Digital Product</span>
                                    <span className="block text-xs text-gray-500">E-books, Courses, Music</span>
                                </span>
                                <FileText className="w-5 h-5 text-gray-400" />
                            </label>

                            <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${productType === 'physical' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                    checked={productType === 'physical'}
                                    onChange={() => setProductType('physical')}
                                />
                                <span className="ml-3 flex-1">
                                    <span className="block text-sm font-medium text-gray-900">Physical Product</span>
                                    <span className="block text-xs text-gray-500">Clothes, Merch, Items</span>
                                </span>
                                <Package className="w-5 h-5 text-gray-400" />
                            </label>
                        </div>
                    </div>

                    {/* Media Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900">Product Content</h2>

                        {/* Delivery Type Selector (Digital Only) */}
                        {productType === 'digital' && (
                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                                <label className="block text-sm font-medium text-gray-700">Delivery Method</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <label className={`border rounded-lg p-3 cursor-pointer text-center hover:bg-gray-50 transition ${deliveryType === 'download' ? 'border-primary ring-1 ring-primary bg-primary/5' : ''}`}>
                                        <input type="radio" name="delivery" className="sr-only" checked={deliveryType === 'download'} onChange={() => setDeliveryType('download')} />
                                        <div className="text-sm font-medium text-gray-900">Direct Download</div>
                                        <div className="text-xs text-gray-500 mt-1">Customer gets the file</div>
                                    </label>
                                    <label className={`border rounded-lg p-3 cursor-pointer text-center hover:bg-gray-50 transition ${deliveryType === 'key_access' ? 'border-primary ring-1 ring-primary bg-primary/5' : ''}`}>
                                        <input type="radio" name="delivery" className="sr-only" checked={deliveryType === 'key_access'} onChange={() => setDeliveryType('key_access')} />
                                        <div className="text-sm font-medium text-gray-900">Access Key/Link</div>
                                        <div className="text-xs text-gray-500 mt-1">Send a code or link</div>
                                    </label>
                                    <label className={`border rounded-lg p-3 cursor-pointer text-center hover:bg-gray-50 transition ${deliveryType === 'view_only' ? 'border-primary ring-1 ring-primary bg-primary/5' : ''}`}>
                                        <input type="radio" name="delivery" className="sr-only" checked={deliveryType === 'view_only'} onChange={() => setDeliveryType('view_only')} />
                                        <div className="text-sm font-medium text-gray-900">View Only (PDF)</div>
                                        <div className="text-xs text-gray-500 mt-1">Read-only on site</div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Access Key Input */}
                        {productType === 'digital' && deliveryType === 'key_access' && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Access Key / Link / Password</label>
                                <textarea
                                    required
                                    placeholder="Enter the key, link, or password the customer will receive..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                    value={deliveryKey}
                                    onChange={(e) => setDeliveryKey(e.target.value)}
                                />
                                <p className="text-xs text-gray-500 mt-1">This will be shown to the customer after payment.</p>
                            </div>
                        )}

                        {/* Cover Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
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
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="cover-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                                    <span>Upload a file</span>
                                                    <input id="cover-upload" name="cover-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Digital File Upload */}
                        {productType === 'digital' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Digital File</label>
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
                                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                                                        <span>Upload Product File</span>
                                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setDigitalFile(e.target.files?.[0] || null)} />
                                                    </label>
                                                </div>
                                                <p className="text-xs text-gray-500">Any file type up to 25MB</p>
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
                    <Button type="submit" size="lg" className="w-full text-lg h-12 shadow-lg hover:shadow-xl transition-all" disabled={loading}>
                        {loading ? status || 'Processing...' : 'Create & Publish Product'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

// Icon wrapper for physical package
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
