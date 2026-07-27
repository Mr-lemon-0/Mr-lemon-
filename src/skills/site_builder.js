const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function buildAndValidateWebsite(clientName, industry) {
  console.log(`[SITE BUILDER] Generating AI-optimized website for ${clientName} (${industry})...`);

  const prompt = `You are a World-Class Full-Stack AI Developer.
Create a high-converting, single-page, beautifully styled responsive HTML/CSS (Tailwind CSS CDN) website for a business named "${clientName}" operating in the "${industry}" sector.
Include:
- Modern Hero Section with compelling Headline
- Key Features / Products Showcase
- Testimonials / Trust Badges
- Interactive Contact / Booking Form
- Clean, modern color palette matching ${industry}

Return ONLY valid HTML code enclosed inside <html>...</html> tags. Do not write any explanations or markdown formatting outside the HTML code.`;

  try {
    let response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
    });

    let code = response.choices[0]?.message?.content.trim();

    // Cleaning Code Block markers if present
    if (code.includes('```html')) {
      code = code.split('```html')[1].split('```')[0].trim();
    } else if (code.includes('```')) {
      code = code.split('```')[1].split('```')[0].trim();
    }

    // AI Self-Correction Check (Validation)
    if (!code.includes('</html>') || !code.includes('</body>')) {
      console.log('[SELF-HEALER] Syntax anomaly detected in generated code. Running auto-repair...');
      code = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>${clientName}</title>\n<script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body>\n${code}\n</body>\n</html>`;
    }

    const outputDir = path.join(__dirname, '../../generated_sites');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `${clientName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_site.html`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, code);

    console.log(`[SITE BUILDER SUCCESS] Website generated and self-corrected at: ${filePath}`);
    return filePath;
  } catch (err) {
    console.error('[SITE BUILDER ERROR] Failed to generate site:', err.message);
    return null;
  }
}

module.exports = { buildAndValidateWebsite };
