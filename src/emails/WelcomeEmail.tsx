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
    Button,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
    name: string;
    username: string;
}

export const WelcomeEmail = ({ name, username }: WelcomeEmailProps) => {
    const storeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://vantage-ivory.vercel.app'}/${username}`;

    return (
        <Html>
            <Head />
            <Preview>Welcome to Vantage!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Welcome to Vantage, {name}!</Heading>
                    <Text style={text}>
                        We're thrilled to have you on board. Your store <strong>{username}</strong> has been successfully created.
                    </Text>

                    <Section style={box}>
                        <Text style={paragraph}>Your Store URL:</Text>
                        <Link style={link} href={storeUrl}>
                            {storeUrl}
                        </Link>
                    </Section>

                    <Text style={text}>
                        You can now log in to your dashboard to start adding products and customizing your store.
                    </Text>

                    <Section style={{ textAlign: "center", marginTop: "32px", marginBottom: "32px" }}>
                        <Button
                            style={button}
                            href="https://vantage-ivory.vercel.app/login"
                        >
                            Go to Dashboard
                        </Button>
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

export default WelcomeEmail;

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
    fontSize: "28px",
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

const box = {
    padding: "24px",
    backgroundColor: "#1a1a1a",
    borderRadius: "8px",
    border: "1px solid #333",
    textAlign: "center" as const,
    marginTop: "32px",
    marginBottom: "32px",
};

const paragraph = {
    fontSize: "14px",
    lineHeight: "24px",
    marginBottom: "8px",
    color: "#888",
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontWeight: '600',
};

const link = {
    color: "#3b82f6",
    textDecoration: "none",
    fontSize: "20px",
    fontWeight: "bold",
    display: "block",
};

const button = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    color: "#000000",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "16px 32px",
    transition: "all 0.2s",
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
