import "server-only";

function getConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not configured");
  }

  return { cloudName, apiKey, apiSecret };
}

async function sha1(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-1", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function signedFields(fields: Record<string, string>) {
  const { apiKey, apiSecret } = getConfig();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const values = { ...fields, timestamp };
  const payload = Object.entries(values)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return { ...values, api_key: apiKey, signature: await sha1(payload + apiSecret) };
}

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadImage(
  file: string | Buffer,
  folder: string = "mmlaptop-center"
): Promise<UploadResult> {
  if (!(typeof file === "string" && file.startsWith("data:")) && !Buffer.isBuffer(file)) {
    throw new Error("Invalid file format");
  }

  const { cloudName } = getConfig();
  const form = new FormData();
  const fields = await signedFields({ folder });
  Object.entries(fields).forEach(([key, value]) => form.set(key, value));
  form.set("file", typeof file === "string" ? file : new Blob([new Uint8Array(file)]));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  const result = await response.json() as Record<string, any>;
  if (!response.ok) throw new Error(result.error?.message || "Cloudinary upload failed");

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

export async function deleteImage(publicId: string): Promise<boolean> {
  const { cloudName } = getConfig();
  const form = new FormData();
  const fields = await signedFields({ public_id: publicId });
  Object.entries(fields).forEach(([key, value]) => form.set(key, value));
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body: form,
  });
  const result = await response.json() as { result?: string; error?: { message?: string } };
  if (!response.ok) throw new Error(result.error?.message || "Cloudinary delete failed");
  return result.result === "ok";
}
