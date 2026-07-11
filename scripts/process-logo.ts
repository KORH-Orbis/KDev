import sharp from "sharp";
import path from "path";

const input = "/home/kevin/Descargas/Gemini_Generated_Image_yoy30gyoy30gyoy3.png";
const publicDir = path.join(process.cwd(), "public");

async function main() {
  // Load original
  const image = sharp(input);
  const metadata = await image.metadata();
  console.log("Original:", metadata.width, "×", metadata.height, metadata.format);

  // Step 1: Remove white/near-white background, make it transparent
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(data);
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    if (r > 235 && g > 235 && b > 235) {
      pixels[i + 3] = 0;
    }
  }

  const noBg = await sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim()
    .png()
    .toBuffer();

  const noBgMeta = await sharp(noBg).metadata();
  console.log("After background removal + trim:", noBgMeta.width, "×", noBgMeta.height);

  // Step 2: Crop out the text at bottom (~22%)
  const cropPct = 0.22;
  const cropH = Math.floor(noBgMeta.height! * (1 - cropPct));

  const logoOnly = await sharp(noBg)
    .extract({ left: 0, top: 0, width: noBgMeta.width!, height: cropH })
    .trim()
    .png()
    .toBuffer();

  const logoMeta = await sharp(logoOnly).metadata();
  console.log("Logo only (cropped):", logoMeta.width, "×", logoMeta.height);

  // Step 3: Resize to max 256px
  const maxSize = 256;
  let w = logoMeta.width!;
  let h = logoMeta.height!;
  if (w > maxSize || h > maxSize) {
    const ratio = Math.min(maxSize / w, maxSize / h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);
  }

  const finalPng = await sharp(logoOnly).resize(w, h).png().toBuffer();

  // Save files
  await sharp(finalPng).toFile(path.join(publicDir, "logo.png"));
  console.log("Saved logo.png:", w, "×", h);

  await sharp(finalPng).toFile(path.join(publicDir, "favicon.ico"));
  console.log("Saved favicon.ico");

  // Navbar version (32px)
  await sharp(logoOnly)
    .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, "logo-32.png"));
  console.log("Saved logo-32.png (32×32)");

  console.log("Done!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
