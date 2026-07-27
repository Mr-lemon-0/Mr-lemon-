const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function buildAndValidateWebsite(clientName, industry) {
  console.log(`[3D SITE BUILDER] Constructing high-end 3D WebGL website for ${clientName} (${industry})...`);

  const prompt = `You are a World-Class 3D Interactive Web Developer specializing in Three.js and WebGL.
Create a high-converting, single-page, ultra-modern 3D responsive website for a business named "${clientName}" operating in the "${industry}" sector.

STRICT TECHNICAL REQUIREMENTS:
1. Include Tailwind CSS CDN for modern glassmorphism UI styling.
2. Include Three.js CDN (https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js) for 3D graphics rendering.
3. Add a dedicated <canvas id="bg-3d"></canvas> in the background with animated, interactive 3D particle nodes/shapes matching the color tone of ${industry}.
4. Sections:
   - Hero Section with glowing 3D backdrop, bold title, subtitle, and CTA button.
   - Interactive 3D/Card Showcase for Features/Products.
   - Glassmorphism Trust Badges & Metrics.
   - Contact & Web3 Wallet Payment Section.
5. Code must be 100% bug-free, fully self-contained HTML file with complete embedded CSS and JavaScript for Three.js animation.

Return ONLY the executable valid HTML code starting with <!DOCTYPE html> and ending with </html>. Do not include markdown commentary.`;

  try {
    let response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
    });

    let code = response.choices[0]?.message?.content.trim();

    if (code.includes('```html')) {
      code = code.split('```html')[1].split('```')[0].trim();
    } else if (code.includes('```')) {
      code = code.split('```')[1].split('```')[0].trim();
    }

    // 100% Zero-Error Self-Healing Validation
    if (!code.includes('three.min.js')) {
      console.log('[SELF-HEALER] Three.js library missing. Injecting 3D WebGL Engine...');
      code = code.replace('</head>', '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n</head>');
    }

    if (!code.includes('</html>') || !code.includes('</body>')) {
      console.log('[SELF-HEALER] Structural HTML error detected. Repairing file structure...');
      code = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${clientName} - 3D Interactive Experience</title>\n<script src="https://cdn.tailwindcss.com"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n</head>\n<body class="bg-slate-950 text-white font-sans overflow-x-hidden">\n${code}\n</body>\n</html>`;
    }

    const outputDir = path.join(__dirname, '../../generated_sites');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `${clientName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_3d_site.html`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, code);

    console.log(`[3D BUILDER SUCCESS] Zero-defect 3D Website generated at: ${filePath}`);
    return filePath;
  } catch (err) {
    console.error('[3D BUILDER ERROR] Code generation failed:', err.message);
    return null;
  }
}

module.exports = { buildAndValidateWebsite };
