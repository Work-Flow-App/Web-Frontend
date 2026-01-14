/**
 * Utility function to copy text to clipboard
 * Works in both HTTPS and HTTP contexts with robust fallback
 */

/**
 * Copies text to clipboard with fallback support for non-HTTPS contexts
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves to true if successful, false otherwise
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  // Try modern Clipboard API first (works in HTTPS contexts)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Clipboard API failed, falling back to execCommand:', err);
      // Fall through to fallback method
    }
  }

  // Fallback for non-HTTPS contexts or when Clipboard API fails
  // This method works in HTTP and older browsers
  return copyToClipboardFallback(text);
};

/**
 * Fallback method using document.execCommand for HTTP contexts
 * NOTE: document.execCommand is deprecated but still necessary for HTTP environments
 * where the modern Clipboard API is not available due to security restrictions.
 * @param text - The text to copy to clipboard
 * @returns true if successful, false otherwise
 */
const copyToClipboardFallback = (text: string): boolean => {
  // Create a temporary textarea element
  const textArea = document.createElement('textarea');

  // Set the value to copy
  textArea.value = text;

  // Make it invisible but functional
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = '0';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.style.opacity = '0';

  // Prevent zoom on iOS
  textArea.style.fontSize = '12pt';

  // Add to DOM
  document.body.appendChild(textArea);

  // Focus and select the text
  textArea.focus();
  textArea.select();

  // For iOS compatibility
  textArea.setSelectionRange(0, text.length);

  let success = false;

  try {
    // Execute the copy command (deprecated but necessary for HTTP fallback)
    success = document.execCommand('copy');
  } catch (err) {
    console.error('execCommand failed:', err);
    success = false;
  }

  // Clean up - remove the textarea
  document.body.removeChild(textArea);

  return success;
};

/**
 * Check if clipboard functionality is available
 * @returns true if clipboard is available, false otherwise
 */
export const isClipboardAvailable = (): boolean => {
  return !!(
    (navigator.clipboard && window.isSecureContext) ||
    // queryCommandSupported is deprecated but necessary for HTTP fallback detection
    document.queryCommandSupported?.('copy')
  );
};
