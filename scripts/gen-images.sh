#!/bin/bash
# Resilient image generation: one process per image with timeout
cd /home/z/my-project

IMAGES=(
  "hero/hero-3|768x1344|Luxury Kashmiri fashion, woman in elegant handcrafted suit with delicate aari embroidery in gold and burgundy, holding a pashmina shawl, warm soft light, ivory and champagne palette, magazine cover style, refined and royal, premium artisan craftsmanship"
  "categories/pherans|864x1152|Elegant folded luxury Kashmiri pheran garment with gold aari embroidery on deep burgundy fabric, flat lay on warm ivory linen, soft natural light, premium product photography, artisan handcrafted luxury fashion"
  "categories/shawls|864x1152|Luxurious pashmina shawl folded elegantly, soft champagne gold and burgundy tones, delicate hand-embroidered border, premium product photography on ivory silk backdrop, soft draping light, heritage luxury"
  "categories/suits|864x1152|Luxury Kashmiri embroidered suit set with intricate sozni hand embroidery, charcoal and gold tones, displayed elegantly on warm ivory background, premium product photography, artisan handcrafted fashion"
  "categories/kaftans|864x1152|Elegant flowing luxury kaftan with gold thread embroidery, warm champagne tone fabric, displayed on ivory background, premium fashion product photography, sophisticated drape"
  "categories/accessories|864x1152|Luxury Kashmiri accessories flat lay, embroidered clutch, gold jewelry, pashmina scarf, on warm ivory linen, soft natural light, premium artisan luxury flat lay photography"
  "lifestyle/artisan|1344x768|Kashmiri artisan hands doing intricate aari needle embroidery on deep burgundy fabric with gold thread, close-up, warm focused light, documentary style, craftsmanship, heritage, premium artisan luxury, shallow depth of field"
  "lifestyle/heritage|1344x768|Beautiful Kashmir valley landscape with traditional wooden architecture, snow-capped mountains in background, golden hour, serene, heritage luxury travel photography, warm tones"
  "lifestyle/craft|1344x768|Traditional Kashmiri weaver at a wooden handloom weaving pashmina shawl, warm ambient light, artisan workshop, documentary craftsmanship photography, heritage, focused and warm"
  "lifestyle/packaging|1024x1024|Luxury gift packaging, ivory box with gold foil logo, burgundy ribbon, tissue paper, elegant minimal premium unboxing presentation, soft studio light, high-end luxury brand packaging"
  "lifestyle/model-1|864x1152|Elegant editorial portrait of an Indian woman wearing a luxury burgundy Kashmiri pheran with gold embroidery, soft cinematic lighting, ivory backdrop, vogue style, timeless royal elegance, premium luxury fashion"
  "lifestyle/model-2|864x1152|Sophisticated woman in a champagne gold embroidered pashmina shawl, editorial luxury fashion portrait, warm soft light, ivory background, regal and minimal, premium heritage brand"
  "lifestyle/insta-1|1024x1024|Luxury fashion flat lay, burgundy and gold accessories, pashmina, jewelry, on ivory marble, top view, premium instagram aesthetic, soft light"
  "lifestyle/insta-2|1024x1024|Elegant woman styling a gold embroidered pashmina shawl, luxury lifestyle, warm tones, instagram aesthetic, candid elegance"
  "lifestyle/insta-3|1024x1024|Close-up of intricate gold aari embroidery on burgundy fabric, luxury craftsmanship detail, macro, warm light, premium artisan"
  "lifestyle/insta-4|1024x1024|Luxury fashion detail, gold jewelry with burgundy silk fabric, elegant styling, premium instagram aesthetic, warm soft light"
  "products/p1|864x1152|Luxury Kashmiri pheran in deep burgundy with gold aari embroidery, displayed on mannequin against warm ivory backdrop, premium fashion product photography, elegant, full length"
  "products/p2|864x1152|Premium pashmina shawl in royal gold and ivory with delicate hand-embroidered border, elegantly draped, premium product photography, soft luxury lighting"
  "products/p3|864x1152|Luxury embroidered Kashmiri suit set, charcoal grey with gold sozni embroidery, displayed elegantly on ivory background, premium fashion product photography"
  "products/p4|864x1152|Elegant champagne gold kaftan with intricate gold thread work, flowing fabric, displayed on warm ivory background, premium luxury fashion product photography"
  "products/p5|864x1152|Luxury pashmina wrap shawl in deep emerald green with gold paisley border embroidery, soft draped, premium product photography, ivory backdrop, heritage luxury"
  "products/p6|864x1152|Premium Kashmiri embroidered pheran in royal blue with silver and gold thread work, elegant display on ivory background, luxury fashion product photography"
  "products/p7|864x1152|Luxury handcrafted Kashmiri suit in ivory with burgundy and gold aari embroidery, elegant display, premium fashion product photography, heritage luxury"
  "products/p8|864x1152|Premium pashmina shawl in blush pink with delicate gold embroidered border, elegantly draped on ivory silk, luxury fashion product photography, soft light"
  "products/p9|864x1152|Luxury Kashmiri pheran in black with gold thread embroidery, elegant full length display on ivory background, premium fashion product photography, sophisticated"
  "products/p10|864x1152|Elegant olive green luxury Kashmiri kaftan with gold zari embroidery, flowing premium fabric on ivory backdrop, luxury fashion product photography"
  "products/p11|864x1152|Premium embroidered pashmina shawl in deep maroon with gold paisley motifs, draped elegantly, ivory background, luxury heritage product photography"
  "products/p12|864x1152|Luxury cream ivory Kashmiri suit with burgundy and gold hand embroidery, elegant display, premium fashion product photography, heritage luxury craftsmanship"
)

for entry in "${IMAGES[@]}"; do
  IFS='|' read -r name size prompt <<< "$entry"
  out="public/images/${name}.png"
  if [ -f "$out" ]; then echo "SKIP $name"; continue; fi
  echo "GEN $name ($size)"
  timeout 120 bun -e "
    import ZAI from 'z-ai-web-dev-sdk';
    import fs from 'fs';
    (async () => {
      try {
        const zai = await ZAI.create();
        const res = await zai.images.generations.create({ prompt: process.argv[2], size: process.argv[3] });
        fs.mkdirSync('public/images/${name%/*}', { recursive: true });
        fs.writeFileSync('${out}', Buffer.from(res.data[0].base64, 'base64'));
        console.log('OK ${name}');
      } catch(e) { console.error('FAIL ${name}', e.message); process.exit(1); }
    })();
  " "$prompt" "$size" 2>&1 | tail -1
  if [ ! -f "$out" ]; then echo "RETRY $name"; sleep 2; fi
done
echo "BATCH DONE"
