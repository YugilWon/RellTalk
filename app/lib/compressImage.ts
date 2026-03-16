import imageCompression from "browser-image-compression";

export async function compressImage(file: File) {
  if (file.size < 200 * 1024) {
    return file;
  }

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 512,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("이미지 압축 실패:", error);
    return file;
  }
}
