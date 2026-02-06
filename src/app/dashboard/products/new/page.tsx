"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { getWhatsAppShareLink } from '@/lib/whatsapp';
import { UploadCloud, Image as ImageIcon, FileText, CheckCircle2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('0'); // Stock for physical products
    const [description, setDescription] = useState('');

    // Type & Delivery
    const [productType, setProductType] = useState<'digital' | 'physical'>('digital');
    const [deliveryType, setDeliveryType] = useState<'download' | 'key_access' | 'view_only'>('download');
    const [deliveryKey, setDeliveryKey] = useState(''); // For keys/links

    // Physical Delivery Options
    const [pickupEnabled, setPickupEnabled] = useState(false);
    const [pickupAddress, setPickupAddress] = useState('');
    const [deliveryEnabled, setDeliveryEnabled] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState('');

    // Files
    const [coverImage, setCoverImage] = useState<File | null>(null); // Replaced by images[0] concept, but keeping for logic transition or main image
    const [images, setImages] = useState<File[]>([]);
    const [digitalFile, setDigitalFile] = useState<File | null>(null);

    const [status, setStatus] = useState<string>(''); // For granular progress updates
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...newFiles].slice(0, 4)); // Limit to 4 images
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

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

            // 1. Upload Images
            const uploadedImageUrls: string[] = [];

            if (images.length > 0) {
                setStatus(`Uploading ${images.length} images...`);
                for (const img of images) {
                    const fileExt = img.name.split('.').pop();
                    const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const { data: imgData, error: imgError } = await supabase.storage
                        .from('products')
                        .upload(`${user.id}/${fileName}`, img, {
                            cacheControl: '3600',
                            upsert: false
                        });

                    if (imgError) throw new Error(`Failed to upload ${img.name}: ` + imgError.message);

                    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(imgData.path);
                    uploadedImageUrls.push(publicUrl);
                }
            }

            // 2. Upload Digital File (if applicable)
            let fileUrl = null;
            if (productType === 'digital' && digitalFile && deliveryType !== 'key_access') {
                setStatus('Uploading digital file...');
                const fileExt = digitalFile.name.split('.').pop();
                const fileName = `file_${Date.now()}.${fileExt}`;
                const { data: fileData, error: fileError } = await supabase.storage
                    .from('products')
                    .upload(`${user.id}/${fileName}`, digitalFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (fileError) throw new Error("Failed to upload digital file: " + fileError.message);

                const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileData.path);
                fileUrl = publicUrl;
            }

            // 3. Prepare Delivery Info (Physical)
            let deliveryInfo = null;
            if (productType === 'physical') {
                deliveryInfo = {
                    pickup: {
                        enabled: pickupEnabled,
                        address: pickupEnabled ? pickupAddress : ''
                    },
                    delivery: {
                        enabled: deliveryEnabled,
                        fee: deliveryEnabled ? parseFloat(deliveryFee) : 0
                    }
                };
            }

            // 4. Insert into Database
            setStatus('Saving product details...');
            const { error } = await supabase
                .from('products')
                .insert([
                    {
                        user_id: user.id,
                        name,
                        price: parseFloat(price),
                        description,
                        image_url: uploadedImageUrls[0] || null, // First image is cover
                        images: uploadedImageUrls, // New column
                        file_url: fileUrl,
                        is_active: true,
                        stock: productType === 'physical' ? parseInt(stock) : 0,
                        delivery_type: productType === 'digital' ? deliveryType : null,
                        delivery_key: (productType === 'digital' && deliveryType === 'key_access') ? deliveryKey : null,
                        delivery_info: deliveryInfo // New column
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

            // Reload or Redirect
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
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
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
                                placeholder="e.g. Vintage Denim Jacket"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                placeholder="Describe your product... dimensions, material, condition etc."
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

                    {/* Images Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
                            <span className="text-xs text-gray-500">{images.length} / 4</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-white/90 rounded-full p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition shadow-sm text-red-500"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    {idx === 0 && (
                                        <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs text-center py-1">Cover</div>
                                    )}
                                </div>
                            ))}

                            {images.length < 4 && (
                                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-xs text-gray-500 font-medium">Add Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="sr-only"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">First image will be the cover. Max 4 images.</p>
                    </div>

                    {/* Physical Delivery Types Card */}
                    {productType === 'physical' && (
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">Delivery Options</h2>

                            {/* Inventory */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-4">
                                {/* Local Pickup */}
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="pickup"
                                        className="mt-1 h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                                        checked={pickupEnabled}
                                        onChange={(e) => setPickupEnabled(e.target.checked)}
                                    />
                                    <div className="flex-1 space-y-2">
                                        <label htmlFor="pickup" className="block text-sm font-medium text-gray-900">Enable Local Pickup</label>
                                        <p className="text-xs text-gray-500">Customers can come to pick up the item.</p>

                                        {pickupEnabled && (
                                            <input
                                                type="text"
                                                placeholder="Enter pickup address / area"
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                value={pickupAddress}
                                                onChange={(e) => setPickupAddress(e.target.value)}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Delivery */}
                                <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
                                    <input
                                        type="checkbox"
                                        id="delivery"
                                        className="mt-1 h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                                        checked={deliveryEnabled}
                                        onChange={(e) => setDeliveryEnabled(e.target.checked)}
                                    />
                                    <div className="flex-1 space-y-2">
                                        <label htmlFor="delivery" className="block text-sm font-medium text-gray-900">Enable Delivery / Shipping</label>
                                        <p className="text-xs text-gray-500">You will arrange delivery to the customer.</p>

                                        {deliveryEnabled && (
                                            <div className="relative w-48">
                                                <span className="absolute left-3 top-2 text-gray-500 text-sm">₦</span>
                                                <input
                                                    type="number"
                                                    placeholder="Delivery Fee"
                                                    className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                    value={deliveryFee}
                                                    onChange={(e) => setDeliveryFee(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Type & Digital Options */}
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

                    {/* Digital Options Card */}
                    {productType === 'digital' && (
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">Digital Delivery</h2>

                            {/* Delivery Type Selector */}
                            <div className="space-y-4 pb-4 border-b border-gray-100">
                                <label className="block text-sm font-medium text-gray-700">Method</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3">
                                        <input type="radio" name="delivery" checked={deliveryType === 'download'} onChange={() => setDeliveryType('download')} />
                                        <span className="text-sm">Direct Download</span>
                                    </label>
                                    <label className="flex items-center gap-3">
                                        <input type="radio" name="delivery" checked={deliveryType === 'key_access'} onChange={() => setDeliveryType('key_access')} />
                                        <span className="text-sm">Access Key / Link</span>
                                    </label>
                                    <label className="flex items-center gap-3">
                                        <input type="radio" name="delivery" checked={deliveryType === 'view_only'} onChange={() => setDeliveryType('view_only')} />
                                        <span className="text-sm">View Only (PDF)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Access Key Input */}
                            {deliveryType === 'key_access' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Key / Link</label>
                                    <textarea
                                        required
                                        placeholder="Enter the key, link, or password..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                        value={deliveryKey}
                                        onChange={(e) => setDeliveryKey(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* Digital File Upload */}
                            {deliveryType !== 'key_access' && (
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
                                                            <span>Upload File</span>
                                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setDigitalFile(e.target.files?.[0] || null)} />
                                                        </label>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Submit Action */}
                    <div className="sticky top-6">
                        {errorMsg && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                                <p className="font-bold">Error</p>
                                <p className="text-sm">{errorMsg}</p>
                            </div>
                        )}
                        <Button type="submit" size="lg" className="w-full text-lg h-12 shadow-lg hover:shadow-xl transition-all" disabled={loading}>
                            {loading ? status || 'Processing...' : 'Create Product'}
                        </Button>
                    </div>
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
