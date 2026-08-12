import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT = path.resolve(process.cwd(), 'public/images');

const tasks: { name: string; prompt: string; size: string }[] = [
  // Hero images
  { name: 'hero/hero-1', size: '768x1344', prompt: 'Luxury fashion editorial photograph, elegant Indian woman wearing a deep burgundy Kashmiri pheran with intricate gold thread embroidery, standing in a serene valley with snow-capped mountains, golden hour cinematic lighting, soft film grain, vogue magazine style, full body, graceful pose, premium luxury fashion photography, warm ivory and burgundy tones' },
  { name: 'hero/hero-2', size: '768x1344', prompt: 'Cinematic luxury fashion portrait, elegant woman draped in an embroidered pashmina shawl with royal gold and burgundy tones, soft warm studio lighting, ivory background, sophisticated, timeless elegance, high fashion editorial, premium heritage luxury brand aesthetic' },
  { name: 'hero/hero-3', size: '768x1344', prompt: 'Luxury Kashmiri fashion, woman in an elegant handcrafted suit with delicate aari embroidery in gold and burgundy, holding a pashmina shawl, warm soft light, ivory and champagne palette, magazine cover style, refined and royal, premium artisan craftsmanship' },

  // Categories
  { name: 'categories/pherans', size: '864x1152', prompt: 'Elegant folded luxury Kashmiri pheran garment with gold aari embroidery on deep burgundy fabric, flat lay on warm ivory linen, soft natural light, premium product photography, artisan handcrafted luxury fashion' },
  { name: 'categories/suits', size: '864x1152', prompt: 'Luxury Kashmiri embroidered suit set with intricate sozni hand embroidery, charcoal and gold tones, displayed elegantly on warm ivory background, premium product photography, artisan handcrafted fashion' },
  { name: 'categories/shawls', size: '864x1152', prompt: 'Luxurious pashmina shawl folded elegantly, soft champagne gold and burgundy tones, delicate hand-embroidered border, premium product photography on ivory silk backdrop, soft draping light, heritage luxury' },
  { name: 'categories/kaftans', size: '864x1152', prompt: 'Elegant flowing luxury kaftan with gold thread embroidery, warm champagne tone fabric, displayed on ivory background, premium fashion product photography, sophisticated drape' },
  { name: 'categories/accessories', size: '864x1152', prompt: 'Luxury Kashmiri accessories flat lay, embroidered clutch, gold jewelry, pashmina scarf, on warm ivory linen, soft natural light, premium artisan luxury flat lay photography' },

  // Lifestyle / Artisan
  { name: 'lifestyle/artisan', size: '1344x768', prompt: 'Kashmiri artisan hands doing intricate aari needle embroidery on deep burgundy fabric with gold thread, close-up, warm focused light, documentary style, craftsmanship, heritage, premium artisan luxury, shallow depth of field' },
  { name: 'lifestyle/heritage', size: '1344x768', prompt: 'Beautiful Kashmir valley landscape with traditional wooden architecture, snow-capped mountains in background, golden hour, serene, heritage luxury travel photography, warm tones' },
  { name: 'lifestyle/craft', size: '1344x768', prompt: 'Traditional Kashmiri weaver at a wooden handloom weaving pashmina shawl, warm ambient light, artisan workshop, documentary craftsmanship photography, heritage, focused and warm' },
  { name: 'lifestyle/packaging', size: '1024x1024', prompt: 'Luxury gift packaging, ivory box with gold foil logo, burgundy ribbon, tissue paper, elegant minimal premium unboxing presentation, soft studio light, high-end luxury brand packaging' },

  // Products
  { name: 'products/p1', size: '864x1152', prompt: 'Luxury Kashmiri pheran in deep burgundy with gold aari embroidery, displayed on mannequin against warm ivory backdrop, premium fashion product photography, elegant, full length' },
  { name: 'products/p2', size: '864x1152', prompt: 'Premium pashmina shawl in royal gold and ivory with delicate hand-embroidered border, elegantly draped, premium product photography, soft luxury lighting' },
  { name: 'products/p3', size: '864x1152', prompt: 'Luxury embroidered Kashmiri suit set, charcoal grey with gold sozni embroidery, displayed elegantly on ivory background, premium fashion product photography' },
  { name: 'products/p4', size: '864x1152', prompt: 'Elegant champagne gold kaftan with intricate gold thread work, flowing fabric, displayed on warm ivory background, premium luxury fashion product photography' },
  { name: 'products/p5', size: '864x1152', prompt: 'Luxury pashmina wrap shawl in deep emerald green with gold paisley border embroidery, soft draped, premium product photography, ivory backdrop, heritage luxury' },
  { name: 'products/p6', size: '864x1152', prompt: 'Premium Kashmiri embroidered pheran in royal blue with silver and gold thread work, elegant display on ivory background, luxury fashion product photography' },
  { name: 'products/p7', size: '864x1152', prompt: 'Luxury handcrafted Kashmiri suit in ivory with burgundy and gold aari embroidery, elegant display, premium fashion product photography, heritage luxury' },
  { name: 'products/p8', size: '864x1152', prompt: 'Premium pashmina shawl in blush pink with delicate gold embroidered border, elegantly draped on ivory silk, luxury fashion product photography, soft light' },
  { name: 'products/p9', size: '864x1152', prompt: 'Luxury Kashmiri pheran in black with gold thread embroidery, elegant full length display on ivory background, premium fashion product photography, sophisticated' },
  { name: 'products/p10', size: '864x1152', prompt: 'Elegant olive green luxury Kashmiri kaftan with gold zari embroidery, flowing premium fabric on ivory backdrop, luxury fashion product photography' },
  { name: 'products/p11', size: '864x1152', prompt: 'Premium embroidered pashmina shawl in deep maroon with gold paisley motifs, draped elegantly, ivory background, luxury heritage product photography' },
  { name: 'products/p12', size: '864x1152', prompt: 'Luxury cream ivory Kashmiri suit with burgundy and gold hand embroidery, elegant display, premium fashion product photography, heritage luxury craftsmanship' },

  // Instagram / gallery
  { name: 'lifestyle/insta-1', size: '1024x1024', prompt: 'Luxury fashion flat lay, burgundy and gold accessories, pashmina, jewelry, on ivory marble, top view, premium instagram aesthetic, soft light' },
  { name: 'lifestyle/insta-2', size: '1024x1024', prompt: 'Elegant woman styling a gold embroidered pashmina shawl, luxury lifestyle, warm tones, instagram aesthetic, candid elegance' },
  { name: 'lifestyle/insta-3', size: '1024x1024', prompt: 'Close-up of intricate gold aari embroidery on burgundy fabric, luxury craftsmanship detail, macro, warm light, premium artisan' },
  { name: 'lifestyle/insta-4', size: '1024x1024', prompt: 'Luxury fashion detail, gold jewelry with burgundy silk fabric, elegant styling, premium instagram aesthetic, warm soft light' },

  // About / model
  { name: 'lifestyle/model-1', size: '864x1152', prompt: 'Elegant editorial portrait of an Indian woman wearing a luxury burgundy Kashmiri pheran with gold embroidery, soft cinematic lighting, ivory backdrop, vogue style, timeless royal elegance, premium luxury fashion' },
  { name: 'lifestyle/model-2', size: '864x1152', prompt: 'Sophisticated woman in a champagne gold embroidered pashmina shawl, editorial luxury fashion portrait, warm soft light, ivory background, regal and minimal, premium heritage brand' },
];

async function run() {
  const zai = await ZAI.create();
  const done: string[] = [];
  for (const t of tasks) {
    const outPath = path.join(OUT, `${t.name}.png`);
    if (fs.existsSync(outPath)) { console.log('skip', t.name); done.push(t.name); continue; }
    try {
      console.log('generating', t.name, t.size);
      const res = await zai.images.generations.create({ prompt: t.prompt, size: t.size as any });
      const b64 = res.data[0].base64;
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
      console.log('ok', t.name);
      done.push(t.name);
    } catch (e: any) {
      console.error('fail', t.name, e?.message);
    }
  }
  console.log('ALL DONE', done.length);
}

run().catch(e => { console.error(e); process.exit(1); });
