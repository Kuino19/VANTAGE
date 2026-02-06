import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import WelcomeEmail from '../../../emails/WelcomeEmail';
import ReceiptEmail from '../../../emails/ReceiptEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type = 'receipt', email } = body;

        let subject = '';
        let emailHtml = '';

        if (type === 'welcome') {
            const { name, username } = body;
            subject = 'Welcome to Vantage - Your Store is Ready!';
            emailHtml = await render(WelcomeEmail({ name, username }));
        } else {
            // Default to 'receipt'
            const { product_name, price, delivery_type, access_info, seller_name } = body;
            subject = `Receipt: ${product_name}`;
            emailHtml = await render(ReceiptEmail({
                seller_name,
                product_name,
                price,
                delivery_type,
                access_info
            }));
        }

        const { data, error } = await resend.emails.send({
            from: 'Vantage Store <onboarding@resend.dev>',
            to: [email],
            subject: subject,
            html: emailHtml,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 400 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error("Email error:", error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
