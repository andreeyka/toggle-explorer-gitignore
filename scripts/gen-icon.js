const { Resvg } = require("@resvg/resvg-js");
const fs = require("fs");
const path = require("path");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <!-- Фон: скруглённый прямоугольник -->
  <rect width="128" height="128" rx="24" ry="24" fill="#1e1e2e"/>

  <!-- Глаз: внешний контур (веко) -->
  <path d="M20 64 C35 38, 93 38, 108 64 C93 90, 35 90, 20 64 Z"
        fill="none" stroke="#89b4fa" stroke-width="6" stroke-linejoin="round"/>

  <!-- Зрачок + радужка -->
  <circle cx="64" cy="64" r="16" fill="#89b4fa"/>
  <circle cx="64" cy="64" r="8" fill="#1e1e2e"/>
  <circle cx="69" cy="59" r="3" fill="#cdd6f4" opacity="0.6"/>

  <!-- Перечёркивание: красная диагональная полоса -->
  <line x1="22" y1="22" x2="106" y2="106"
        stroke="#f38ba8" stroke-width="8" stroke-linecap="round"/>

  <!-- Тонкая белая обводка линии для читаемости -->
  <line x1="22" y1="22" x2="106" y2="106"
        stroke="#1e1e2e" stroke-width="3" stroke-linecap="round" opacity="0.4"/>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 128 },
});

const png = resvg.render().asPng();
const outPath = path.join(__dirname, "..", "images", "icon.png");

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, png);
console.log(`Icon generated: ${outPath} (${png.length} bytes)`);
