/**
 * Guest data management for onboarding and review prompts
 */

const ONBOARDING_SHOWN_KEY = 'hostelguide_onboarding_shown';
const CHECKOUT_DATE_KEY = 'hostelguide_guest_checkout_date';
const PHONE_KEY = 'hostelguide_guest_phone';
const REVIEW_SHOWN_KEY = 'hostelguide_review_prompt_shown';

// ============================================
// Onboarding state
// ============================================

export function hasSeenOnboarding(): boolean {
  if (typeof localStorage === 'undefined') return true;
  return localStorage.getItem(ONBOARDING_SHOWN_KEY) === 'true';
}

export function markOnboardingShown(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(ONBOARDING_SHOWN_KEY, 'true');
}

// ============================================
// Guest data
// ============================================

export function saveGuestData(checkoutDate: string, phone: string): void {
  if (typeof localStorage === 'undefined') return;
  if (checkoutDate) {
    localStorage.setItem(CHECKOUT_DATE_KEY, checkoutDate);
  }
  if (phone) {
    localStorage.setItem(PHONE_KEY, phone);
  }
}

export function getCheckoutDate(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(CHECKOUT_DATE_KEY);
}

export function getGuestPhone(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(PHONE_KEY);
}

// ============================================
// Review prompt
// ============================================

export function shouldShowReviewPrompt(): boolean {
  if (typeof localStorage === 'undefined') return false;

  const checkoutDate = getCheckoutDate();
  if (!checkoutDate) return false;

  const shown = localStorage.getItem(REVIEW_SHOWN_KEY) === 'true';
  if (shown) return false;

  // Compare dates: show prompt on checkout day (or after)
  const checkout = new Date(checkoutDate);
  const now = new Date();

  // Compare only the date part (ignore time)
  const checkoutDay = checkout.toISOString().split('T')[0];
  const today = now.toISOString().split('T')[0];

  return today >= checkoutDay;
}

export function markReviewPromptShown(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(REVIEW_SHOWN_KEY, 'true');
}

// ============================================
// Webhook submission
// ============================================

export interface GuestDataPayload {
  checkoutDate: string;
  phone: string;
  timestamp: string;
}

export async function submitGuestData(
  webhookUrl: string,
  checkoutDate: string,
  phone: string
): Promise<boolean> {
  if (!webhookUrl) return true; // No webhook configured, consider success

  try {
    const payload: GuestDataPayload = {
      checkoutDate,
      phone,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to submit guest data:', error);
    return false;
  }
}

// ============================================
// Migration from old onboarding system
// ============================================

export function migrateOldOnboardingData(): void {
  if (typeof localStorage === 'undefined') return;

  // Check if old onboarding was completed
  const oldCompleted = localStorage.getItem('hostelguide_onboarding_completed');
  if (oldCompleted === 'true') {
    markOnboardingShown();
  }

  // Remove old keys
  localStorage.removeItem('hostelguide_onboarding_completed');
  localStorage.removeItem('hostelguide_onboarding_step');
}

// ============================================
// Reset for testing / replay
// ============================================

export function resetGuestData(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(ONBOARDING_SHOWN_KEY);
  localStorage.removeItem(CHECKOUT_DATE_KEY);
  localStorage.removeItem(PHONE_KEY);
  localStorage.removeItem(REVIEW_SHOWN_KEY);
}
