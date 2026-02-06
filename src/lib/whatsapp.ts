/**
 * Generates a WhatsApp link with a pre-filled message.
 * @param phone The seller's phone number (international format without +).
 * @param message The message to pre-fill.
 * @returns The WhatsApp URL.
 */
export const getWhatsAppLink = (phone: string, message: string) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
};

/**
 * Generates the message for the "Chat to Buy" feature.
 * @param productName Name of the product
 * @param productUrl URL of the product page
 * @returns The generic buying inquiry message.
 */
export const getBuyMessage = (productName: string, productUrl: string) => {
    return `Hi, I am interested in getting "${productName}". I saw it on Vantage: ${productUrl}`;
};

/**
 * Generates a link to share text on WhatsApp (e.g. for sellers sharing their product).
 * @param text The text to share.
 * @returns The WhatsApp share URL.
 */
export const getWhatsAppShareLink = (text: string) => {
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
};
