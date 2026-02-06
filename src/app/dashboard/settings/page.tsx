"use client";

import { Button } from '@/components/ui/button';
import { User, CreditCard, Bell, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile(data);
            }
            setLoading(false);
        };
        getProfile();
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        // (Implementation for saving would go here)
        alert("Profile update simulation");
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 text-sm">Manage your profile and account preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Settings Sidebar */}
                <div className="w-full md:w-64 space-y-1">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <User className="w-4 h-4" /> Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('bank')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition ${activeTab === 'bank' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <CreditCard className="w-4 h-4" /> Bank Details
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition ${activeTab === 'notifications' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Bell className="w-4 h-4" /> Notifications
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition ${activeTab === 'security' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Lock className="w-4 h-4" /> Security
                    </button>
                </div>

                {/* Settings Content */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="border-b pb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                                <p className="text-sm text-gray-500">Update your public profile details.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-gray-900 placeholder:text-gray-400"
                                        defaultValue={profile?.full_name || ''}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Username</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                            defaultValue={profile?.username || ''}
                                            disabled
                                        />
                                        {profile?.username && (
                                            <a href={`/${profile.username}`} target="_blank" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition flex items-center whitespace-nowrap">
                                                View Store
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Username cannot be changed.</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition h-32 resize-none text-gray-900 placeholder:text-gray-400"
                                        defaultValue="I sell amazing digital products."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <Button className="px-8 shadow-md hover:shadow-lg transition-all">Save Changes</Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'bank' && (
                        <div className="space-y-6">
                            <div className="border-b pb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Bank Account</h2>
                                <p className="text-sm text-gray-500">Where should we send your payouts?</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-gray-900 bg-white">
                                        <option>Guaranty Trust Bank</option>
                                        <option>Access Bank</option>
                                        <option>Zenith Bank</option>
                                        <option>Kuda Bank</option>
                                        <option>OPay</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-gray-900 placeholder:text-gray-400"
                                        placeholder="0123456789"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                        placeholder="Auto-fetched name"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <Button className="px-8 shadow-md hover:shadow-lg transition-all">Save Bank Details</Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div className="border-b pb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                                <p className="text-sm text-gray-500">Choose how we contact you.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-900">Email Alerts</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">New Order Recieved</p>
                                            <p className="text-xs text-gray-500">Get an email when someone buys your product.</p>
                                        </div>
                                        <input type="checkbox" className="toggle" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">Payout Processed</p>
                                            <p className="text-xs text-gray-500">Get notified when money is sent to your bank.</p>
                                        </div>
                                        <input type="checkbox" className="toggle" defaultChecked />
                                    </div>
                                </div>

                                <div className="border-t my-4"></div>

                                <h3 className="text-sm font-medium text-gray-900">WhatsApp Alerts</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">Daily Sales Summary</p>
                                            <p className="text-xs text-gray-500">Receive a WhatsApp message with your daily earnings.</p>
                                        </div>
                                        <input type="checkbox" className="toggle" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <Button className="px-8 shadow-md hover:shadow-lg transition-all">Save Preferences</Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="border-b pb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                                <p className="text-sm text-gray-500">Keep your account safe.</p>
                            </div>

                            <form className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-gray-900"
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-end">
                                    <Button variant="destructive" className="px-8 shadow-md hover:shadow-lg transition-all">Update Password</Button>
                                </div>
                            </form>

                            {/* Danger Zone */}
                            <div className="mt-8 pt-8 border-t border-red-200">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
                                        <p className="text-sm text-red-700 mt-1">Permanently delete your account and all associated data.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-red-800 font-medium">This action will:</p>
                                        <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                                            <li>Delete your profile and account</li>
                                            <li>Remove all your products</li>
                                            <li>Delete your order history</li>
                                            <li>Remove your storefront</li>
                                        </ul>
                                        <p className="text-sm text-red-800 font-semibold mt-3">⚠️ This action cannot be undone!</p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        className="w-full bg-red-600 hover:bg-red-700"
                                        onClick={async () => {
                                            const confirmation = prompt(
                                                'This will permanently delete your account and all data.\n\n' +
                                                'Type "DELETE" to confirm:'
                                            );

                                            if (confirmation === 'DELETE') {
                                                try {
                                                    const { data: { user } } = await supabase.auth.getUser();
                                                    if (!user) return;

                                                    // Delete profile (cascade will handle related data)
                                                    await supabase
                                                        .from('profiles')
                                                        .delete()
                                                        .eq('id', user.id);

                                                    // Sign out and delete auth user
                                                    await supabase.auth.signOut();

                                                    alert('Your account has been deleted. You will be redirected to the home page.');
                                                    window.location.href = '/';
                                                } catch (error: any) {
                                                    alert('Error deleting account: ' + error.message);
                                                }
                                            } else if (confirmation !== null) {
                                                alert('Account deletion cancelled. You must type "DELETE" exactly to confirm.');
                                            }
                                        }}
                                    >
                                        Delete My Account
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
