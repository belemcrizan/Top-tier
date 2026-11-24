export function downloadBlob(blob: Blob, name: string): void {
  const address = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = address;
  anchor.download = name;
  anchor.click();
  // Keep the URL alive until the browser has taken ownership of the download.
  window.setTimeout(() => URL.revokeObjectURL(address), 1_000);
}
