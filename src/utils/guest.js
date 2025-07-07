// src/utils/guest.js
import { v4 as uuidv4 } from "uuid";

export function initGuestId() {
    // check if cookie already set
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem('guestId', guestId);
        // Also set as cookie for backend if needed
        document.cookie = `guestId=${guestId}; path=/; SameSite=None; Secure; max-age=31536000`;
    }
    return guestId;
}

export function clearGuestId() {
    localStorage.removeItem('guestId');
    document.cookie = 'guestId=; Max-Age=0; path=/; SameSite=None; Secure;';
}