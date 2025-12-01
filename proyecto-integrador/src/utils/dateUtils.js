/**
 * Format a date string (YYYY-MM-DD) to a localized string.
 * Ensures the date is treated as local time, avoiding timezone shifts.
 * 
 * @param {string} dateString - The date string in YYYY-MM-DD format.
 * @param {Object} options - Intl.DateTimeFormat options.
 * @returns {string} - The formatted date string.
 */
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return '';

    // Parse YYYY-MM-DD manually to avoid UTC conversion issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options
    };

    return date.toLocaleDateString('es-ES', defaultOptions);
};

/**
 * Check if a task is overdue.
 * A task is overdue if its due date is strictly before today (local time).
 * Tasks due today are NOT overdue.
 * 
 * @param {string} dateString - The date string in YYYY-MM-DD format.
 * @returns {boolean} - True if the date is before today.
 */
export const isOverdue = (dateString) => {
    if (!dateString) return false;

    const [year, month, day] = dateString.split('-').map(Number);
    const dueDate = new Date(year, month - 1, day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return dueDate < today;
};
