/**
 * Universally compatible UUID generator for 2025+
 *
 * Priority order:
 * 1. crypto.randomUUID()  (modern browsers, secure contexts)
 * 2. crypto.getRandomValues()  (all browsers since ~2018)
 * 3. Math.random() fallback (rarely needed, but ensures 100% compatibility)
 */

export function uuid(): string {
    // 1) Modern, secure, standard
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        try {
            return crypto.randomUUID();
        } catch {
            // some browsers throw in non-secure contexts → fallback
        }
    }

    // 2) RFC 4122 compliant fallback using getRandomValues
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);

        // Per RFC 4122
        bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
        bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant

        return [...bytes]
            .map((b, i) =>
                (i === 4 || i === 6 || i === 8 || i === 10 ? "-" : "") +
                b.toString(16).padStart(2, "0")
            )
            .join("");
    }

    // 3) Final fallback — not cryptographically secure, but universal
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
        const r = (Math.random() * 16) | 0;
        const v = ch === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
