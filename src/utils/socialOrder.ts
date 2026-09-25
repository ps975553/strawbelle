import { Product, ProductColor } from '../types';

export interface SocialOrderPayload {
  product: Product;
  selectedColor?: ProductColor;
  quantity?: number;
  formatPrice: (amount: number) => string;
  customNotes?: string;
  onToast?: (title: string, message: string, type?: 'success' | 'info' | 'error' | 'gold') => void;
}

export const getProductShareUrl = (productId: string): string => {
  const safeId = encodeURIComponent(productId);
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    return `${origin}/#product-${safeId}`;
  }
  return `https://strawbelle.com/#product-${safeId}`;
};

export const copyOrderTextToClipboard = async (text: string): Promise<boolean> => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API write failed, using fallback:', err);
    }
  }

  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      document.body.removeChild(textarea);
      return copied;
    } catch (err) {
      console.warn('Clipboard fallback failed:', err);
    }
  }

  return false;
};

export const buildProductOrderMessage = ({
  product,
  selectedColor,
  quantity = 1,
  formatPrice,
  customNotes
}: SocialOrderPayload): string => {
  const chosenColor = selectedColor?.name || product.colors[0]?.name || 'Signature';
  const unitPrice = formatPrice(product.price);
  const totalPrice = formatPrice(product.price * quantity);
  const productUrl = getProductShareUrl(product.id);

  const lines = [
    `👜 *STRAWBELLE LUXURY ORDER INQUIRY*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `✨ *Piece:* ${product.title}`,
    `🏷️ *SKU:* ${product.sku}`,
    `🎨 *Colorway:* ${chosenColor}`,
    `📦 *Quantity:* ${quantity}`,
    `💰 *Unit Price:* ${unitPrice}`,
    `💎 *Total:* ${totalPrice}`,
    `🧵 *Material:* ${product.material}`,
    `🔗 *Product Link:* ${productUrl}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
  ];

  if (customNotes) {
    lines.push(`📝 *Client Note:* ${customNotes}`);
  }

  lines.push(`Please confirm piece availability and VIP dispatch from the Florence atelier. Thank you!`);

  return lines.join('\n');
};

export const STRAWBELLE_WHATSAPP_PHONE = '919517220111';
export const STRAWBELLE_WHATSAPP_DISPLAY = '+91 95172 20111';
export const STRAWBELLE_INSTAGRAM_HANDLE = '@strawbelle_bags';
export const STRAWBELLE_INSTAGRAM_URL = 'https://www.instagram.com/strawbelle_bags?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==';
export const STRAWBELLE_EMAIL = 'concierge@strawbelle.com';
export const STRAWBELLE_EMAIL_MAILTO = 'mailto:concierge@strawbelle.com?subject=Strawbelle%20Luxury%20Inquiry&body=Hello%20Strawbelle%20Concierge%2C%0A%0AFollow%20us%20on%20Instagram%3A%20https%3A%2F%2Fwww.instagram.com%2Fstrawbelle_bags%20(%40strawbelle_bags)%0A%0AInquiry%20Details%3A%0A';

export const orderViaWhatsApp = (payload: SocialOrderPayload) => {
  const message = buildProductOrderMessage(payload);
  const encoded = encodeURIComponent(message);
  // Official boutique concierge phone
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${STRAWBELLE_WHATSAPP_PHONE}&text=${encoded}`;
  
  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  if (payload.onToast) {
    payload.onToast(
      'WhatsApp Concierge Initiated',
      'Your order message was opened in WhatsApp.',
      'gold'
    );
  }
};

export const orderViaInstagram = async (payload: SocialOrderPayload) => {
  const message = buildProductOrderMessage(payload);

  // Copy order message to clipboard for seamless pasting into Instagram Direct DM
  await copyOrderTextToClipboard(message);

  const igUrl = STRAWBELLE_INSTAGRAM_URL;
  if (typeof window !== 'undefined') {
    window.open(igUrl, '_blank', 'noopener,noreferrer');
  }

  if (payload.onToast) {
    payload.onToast(
      'Order Copied & Instagram Opened',
      'Order details copied to clipboard! Paste them directly into Strawbelle Instagram Direct (@strawbelle_bags).',
      'gold'
    );
  }
};
