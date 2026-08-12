import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const name = process.argv[2];
const size = process.argv[3];
const prompt = process.argv[4];
const out = `public/images/${name}.png`;

if (fs.existsSync(out)) { console.log('SKIP', name); process.exit(0); }

(async () => {
  try {
    const zai = await ZAI.create();
    const res = await zai.images.generations.create({ prompt, size: size as any });
    fs.mkdirSync(`public/images/${name.split('/')[0]}`, { recursive: true });
    fs.writeFileSync(out, Buffer.from(res.data[0].base64, 'base64'));
    console.log('OK', name);
    process.exit(0);
  } catch (e: any) {
    console.error('FAIL', name, e?.message);
    process.exit(1);
  }
})();
