// Turns a source image (data URL) plus the croppedAreaPixels emitted by
// react-easy-crop into a square JPEG data URL (default 512x512), drawn via a
// canvas. Returned value is a base64 data URL ready to POST to /profile/avatar.
export default function getCroppedImg(imageSrc, croppedAreaPixels, size = 512) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          size,
          size
        );
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } catch (err) {
        reject(err);
      }
    };
    image.onerror = reject;
    image.src = imageSrc;
  });
}
