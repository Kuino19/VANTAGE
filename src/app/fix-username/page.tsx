"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function UsernameFixPage() {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [generatedUsername, setGeneratedUsername] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(data);

            // Generate username from full name if missing
            if (data && !data.username && data.full_name) {
                const username = data.full_name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .replace(/[^a-z0-9]/g, '');
                setGeneratedUsername(username);
            }
        }
    };

    const handleUpdateUsername = async () => {
        if (!profile || !generatedUsername) return;

        setLoading(true);
        setMessage('');

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ username: generatedUsername })
                .eq('id', profile.id);

            if (error) throw error;

            setMessage('✅ Username updated successfully! You can now view your store.');
            loadProfile();
        } catch (error: any) {
            setMessage('❌ Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!profile) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add Username to Profile</h1>
                    <p className="text-sm text-gray-500 mt-2">Set up your store username to activate your storefront.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                            value={profile.full_name || ''}
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                            value={profile.username || '(not set)'}
                            disabled
                        />
                    </div>

                    {!profile.username && generatedUsername && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Suggested Username</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-gray-900"
                                value={generatedUsername}
                                onChange={(e) => setGeneratedUsername(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-1">You can edit this before saving.</p>
                        </div>
                    )}
                </div>

                {message && (
                    <div className={`p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message}
                    </div>
                )}

                {!profile.username && (
                    <Button
                        onClick={handleUpdateUsername}
                        disabled={loading || !generatedUsername}
                        className="w-full"
                    >
                        {loading ? 'Updating...' : 'Set Username'}
                    </Button>
                )}

                {profile.username && (
                    <div className="space-y-3">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-700">✅ Your username is set!</p>
                        </div>
                        <a href={`/${profile.username}`} target="_blank" className="block">
                            <Button className="w-full">View My Store</Button>
                        </a>
                        <a href="/dashboard/settings" className="block">
                            <Button variant="outline" className="w-full">Go to Settings</Button>
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
