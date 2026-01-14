/**
 * Generate a Google Maps directions URL
 * Opens in Google Maps app on mobile or web on desktop
 */
export function getDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/**
 * Generate a Google Maps location URL (view only, no directions)
 */
export function getMapsUrl(lat: number, lng: number, name?: string): string {
  const query = name ? encodeURIComponent(name) : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/**
 * Generate a WhatsApp deep link URL
 * Opens WhatsApp with optional pre-filled message
 */
export function getWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const base = `https://wa.me/${cleanPhone}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
