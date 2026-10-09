// Guests open invitations on phones, often on mobile data, and photos are
// served as uploaded. Camera photos (4000px, several MB) are shrunk before
// upload; small images are sent as they are.
const MAX_SIDE = 2000;
const JPEG_QUALITY = 0.85;

/** A JPEG at most MAX_SIDE px on its longest side, or the file itself. */
export async function prepareImage(file: File): Promise<File> {
  try {
    // Applies the EXIF orientation, so portrait photos stay upright.
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1024 * 1024) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas
      .getContext("2d")!
      .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    // Can't decode it here; let the backend judge the original.
    return file;
  }
}
