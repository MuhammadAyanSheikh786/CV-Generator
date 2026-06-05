import ImageKit from "imagekit";

let instance: InstanceType<typeof ImageKit> | null = null;

function getInstance() {
  if (instance) return instance;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
  if (!publicKey || !privateKey || !urlEndpoint) return null;
  instance = new ImageKit({ publicKey, privateKey, urlEndpoint });
  return instance;
}

export async function uploadToImageKit(
  buffer: Buffer,
  fileName: string
): Promise<string | null> {
  const ik = getInstance();
  if (!ik) return null;

  try {
    const result = await ik.upload({
      file: buffer.toString("base64"),
      fileName: `${Date.now()}-${fileName}`,
      folder: "/cv-forge/cvs",
    });
    return result.url as string;
  } catch (error) {
    console.error("ImageKit upload failed:", error);
    return null;
  }
}
