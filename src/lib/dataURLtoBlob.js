// lib/dataURLtoBlob.js
export function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(",");
  if (arr.length !== 2) throw new Error("Invalid data URL");

  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) throw new Error("Invalid data URL");

  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}
