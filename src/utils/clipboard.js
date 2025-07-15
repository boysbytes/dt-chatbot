export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    // You can add a success notification here if you want.
    // For example, using a toast library.
    console.log('Text copied to clipboard');
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};
