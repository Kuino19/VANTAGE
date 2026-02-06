"use client";

import React from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Button } from '@/components/ui/button';

interface PaystackButtonProps {
    amount: number; // in Kobo (e.g. 10000 = 100 Naira)
    email: string;
    publicKey: string;
    onSuccess: (reference: any) => void;
    onClose: () => void;
    text?: string;
}

const PaystackButton = ({ amount, email, publicKey, onSuccess, onClose, text = "Pay Now" }: PaystackButtonProps) => {
    const config = {
        reference: (new Date()).getTime().toString(),
        email,
        amount, // Paystack requires amount in kobo
        publicKey,
    };

    const initializePayment = usePaystackPayment(config);

    return (
        <Button
            onClick={() => {
                initializePayment({ onSuccess, onClose })
            }}
            className="w-full font-bold text-lg"
        >
            {text}
        </Button>
    );
};

export default PaystackButton;
