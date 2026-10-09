export class FileDto {
  id: string;

  /**
   * Public URL of the file.
   * @example "http://localhost:9000/taklifim/uploads/2026/10/0b5e2f4e-8c0a-4e8b-9a43-2f1c7d6b8e11.jpg"
   */
  url: string;

  /** @example "photo.jpg" */
  originalName: string;

  /** @example "image/jpeg" */
  mimeType: string;

  /**
   * Size in bytes.
   * @example 204800
   */
  size: number;

  uploadedById: string | null;

  createdAt: Date;
}
