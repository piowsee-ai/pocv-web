/**
 * Editor Form Validation Utilities
 * 
 * Provides maxLength constants, character validation patterns,
 * and sanitization functions for editor form inputs.
 */

// ============================================================
// MAX LENGTH CONSTANTS
// ============================================================

export const MAX_LENGTH = {
    NAME: 100,
    PHONE: 20,
    EMAIL: 100,
    POSITION: 100,
    DEGREE: 100,
    MAJOR: 100,
    COMPANY: 150,
    ORGANIZATION: 150,
    INSTITUTION: 150,
    LOCATION: 100,
    DESCRIPTION: 2000,
    URL: 100,
    ROLE: 100,
    TITLE: 100,
    SECTION_TITLE: 50,
    SUBTITLE: 100,
} as const;

// ============================================================
// CHARACTER VALIDATION PATTERNS
// ============================================================

/**
 * Name field: Only allows letters (including Unicode), spaces, hyphens, apostrophes, and periods.
 * Examples: "John Doe", "Mary-Jane", "O'Brien", "Dr. Smith"
 */
export const NAME_PATTERN = /^[\p{L}\s\-'.]*$/u;

/**
 * Phone field: Only allows digits and plus sign.
 * Examples: "+628123456789", "08123456789"
 */
export const PHONE_PATTERN = /^[0-9+]*$/;

// ============================================================
// SANITIZATION FUNCTIONS
// ============================================================

/**
 * Sanitize name input - removes invalid characters
 * @param value - The input value to sanitize
 * @returns Sanitized string with only valid name characters
 */
export function sanitizeName(value: string): string {
    // Remove any character that is not: letter, space, hyphen, apostrophe, or period
    return value.replace(/[^\p{L}\s\-'.]/gu, '');
}

/**
 * Sanitize phone input - removes invalid characters
 * @param value - The input value to sanitize
 * @returns Sanitized string with only digits and plus sign
 */
export function sanitizePhone(value: string): string {
    // Remove any character that is not: digit or plus sign
    return value.replace(/[^0-9+]/g, '');
}

/**
 * Truncate string to max length
 * @param value - The input value
 * @param maxLength - Maximum allowed length
 * @returns Truncated string
 */
export function truncateToMaxLength(value: string, maxLength: number): string {
    return value.slice(0, maxLength);
}

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

/**
 * Validate name field
 * @param value - The input value to validate
 * @returns true if valid, false otherwise
 */
export function isValidName(value: string): boolean {
    return NAME_PATTERN.test(value) && value.length <= MAX_LENGTH.NAME;
}

/**
 * Validate phone field
 * @param value - The input value to validate
 * @returns true if valid, false otherwise
 */
export function isValidPhone(value: string): boolean {
    return PHONE_PATTERN.test(value) && value.length <= MAX_LENGTH.PHONE;
}

// ============================================================
// INPUT HANDLER HELPERS
// ============================================================

/**
 * Create onChange handler that sanitizes name input
 */
export function createNameChangeHandler(
    onChange: (value: string) => void
): (e: React.ChangeEvent<HTMLInputElement>) => void {
    return (e) => {
        const sanitized = sanitizeName(e.target.value);
        const truncated = truncateToMaxLength(sanitized, MAX_LENGTH.NAME);
        onChange(truncated);
    };
}

/**
 * Create onChange handler that sanitizes phone input
 */
export function createPhoneChangeHandler(
    onChange: (value: string) => void
): (e: React.ChangeEvent<HTMLInputElement>) => void {
    return (e) => {
        const sanitized = sanitizePhone(e.target.value);
        const truncated = truncateToMaxLength(sanitized, MAX_LENGTH.PHONE);
        onChange(truncated);
    };
}

/**
 * Create onChange handler with max length only (no character filtering)
 */
export function createMaxLengthChangeHandler(
    onChange: (value: string) => void,
    maxLength: number
): (e: React.ChangeEvent<HTMLInputElement>) => void {
    return (e) => {
        const truncated = truncateToMaxLength(e.target.value, maxLength);
        onChange(truncated);
    };
}
