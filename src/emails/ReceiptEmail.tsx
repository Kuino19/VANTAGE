import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface ReceiptEmailProps {
    seller_name: string;
    product_name: string;
    price: number;
    delivery_type: 'download' | 'view_only' | 'key_access' | 'physical';
    access_info: any;
}

export const ReceiptEmail = ({
    seller_name,
    product_name,
    price,
    delivery_type,
    access_info,
}: ReceiptEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Receipt for {product_name}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Order Confirmed</Heading>
                    <Text style={text}>Hi there,</Text>
                    <Text style={text}>
                        Here is the receipt for your order from <strong style={{ color: '#fff' }}>{seller_name}</strong>.
                    </Text>

                    <Section style={orderBox}>
                        <Text style={productTitle}>{product_name}</Text>
                        <Text style={priceText}>₦{price.toLocaleString()}</Text>
                    </Section>

                    {/* Delivery Content Based on Type */}
                    <Section style={deliveryBox}>
                        {delivery_type === 'download' && access_info.file_url ? (
                            <>
                                <Text style={deliveryTitle}>Download your product:</Text>
                                <Link style={downloadButton} href={access_info.file_url}>
                                    Download Now
                                </Link>
                            </>
                        ) : null}

                        {delivery_type === 'view_only' && access_info.access_key ? (
                            <>
                                <Text style={deliveryTitle}>Your Access Key:</Text>
                                <Text style={codeBox}>{access_info.access_key}</Text>
                                <Text style={text}>
                                    <Link style={link} href={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://vantage-ivory.vercel.app'}/view/${access_info.reference}`}>
                                        Access Your Product
                                    </Link>
                                </Text>
                            </>
                        ) : null}

                        {delivery_type === 'key_access' && access_info.delivery_key ? (
                            <>
                                <Text style={deliveryTitle}>Your License/Key:</Text>
                                <Text style={codeBox}>{access_info.delivery_key}</Text>
                            </>
                        ) : null}

                        {delivery_type === 'physical' ? (
                            <>
                                <Text style={deliveryTitle}>Delivery Info:</Text>
                                <Text style={text}>
                                    Your order has been received. The seller ({seller_name}) will conform with you shortly.
                                </Text>
                                {access_info.shipping_address && (
                                    <Section style={shippingBox}>
                                        <Text style={{ fontWeight: 'bold', margin: '0', color: '#fff', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shipping Address</Text>
                                        <Text style={{ margin: '8px 0 0', color: '#ccc' }}>{access_info.shipping_address.address}</Text>
                                        <Text style={{ margin: '0', color: '#ccc' }}>{access_info.shipping_address.city}, {access_info.shipping_address.state}</Text>
                                        <Text style={{ margin: '8px 0 0', color: '#666', fontSize: '13px' }}>Phone: <span style={{ color: '#aaa' }}>{access_info.shipping_address.phone}</span></Text>
                                    </Section>
                                )}
                            </>
                        ) : null}
                    </Section>

                    <Text style={footer}>
                        If you have any questions, reply to this email.
                        <br />
                        Powered by Vantage
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default ReceiptEmail;

const main = {
    backgroundColor: "#000000",
    color: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "40px 20px",
    maxWidth: "560px",
    backgroundColor: "#111111",
    borderRadius: "12px",
    border: "1px solid #333",
    marginTop: "40px",
};

const h1 = {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "800",
    textAlign: "center" as const,
    margin: "30px 0",
    padding: "0",
    letterSpacing: "-0.5px",
};

const text = {
    color: "#e5e5e5",
    fontSize: "16px",
    lineHeight: "26px",
    textAlign: "center" as const,
};

const orderBox = {
    border: "1px solid #333",
    backgroundColor: "#1a1a1a",
    borderRadius: "8px",
    padding: "24px",
    margin: "32px 0",
    textAlign: "center" as const,
};

const productTitle = {
    margin: "0",
    fontSize: "20px",
    fontWeight: "600",
    color: "#ffffff",
};

const priceText = {
    fontSize: "24px",
    fontWeight: "800",
    margin: "8px 0 0",
    color: "#3b82f6",
};

const deliveryBox = {
    marginTop: "20px",
    textAlign: "center" as const,
};

const deliveryTitle = {
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "12px",
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    color: '#888',
};

const downloadButton = {
    backgroundColor: "#ffffff",
    color: "#000000",
    padding: "14px 28px",
    textDecoration: "none",
    borderRadius: "8px",
    display: "inline-block",
    fontWeight: "bold",
    transition: "transform 0.2s",
};

const codeBox = {
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    color: "#fff",
    padding: "16px",
    borderRadius: "8px",
    fontFamily: "monospace",
    fontSize: "20px",
    letterSpacing: "3px",
    textAlign: "center" as const,
    marginBottom: "16px",
};

const link = {
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: "bold",
};

const shippingBox = {
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "16px",
    textAlign: "left" as const,
};

const footer = {
    color: "#666666",
    fontSize: "12px",
    lineHeight: "24px",
    marginTop: "40px",
    textAlign: "center" as const,
    borderTop: "1px solid #333",
    paddingTop: "20px",
};
