// src/utils/guest.js
import { v4 as uuidv4 } from "uuid";

export function initGuestId() {
    // check if cookie already set
    const has = document.cookie.split("; ").some(c => c.startsWith("guestId="));
    if (!has) {
        const id = uuidv4();
        // set a 30‑day cookie
        document.cookie = `guestId=${id}; Path=/; max-age=${60 * 60 * 24 * 30}`;
    }
}