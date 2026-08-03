#!/bin/bash
# Génération d'icônes PNG pour NainoForge
# Utilise cairosvg ou convert (ImageMagick)

SIZE=$1
OUTPUT="public/icons/icon-${SIZE}.png"

# Créer un SVG temporaire
cat > /tmp/icon-${SIZE}.svg << SVGEOL
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7C3AED;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#5B21B6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" rx="${SIZE/4}" fill="url(#grad)"/>
  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="${SIZE/2}" font-weight="bold" fill="white">N</text>
</svg>
SVGEOL

# Convertir en PNG avec ImageMagick si disponible
if command -v convert &> /dev/null; then
    convert /tmp/icon-${SIZE}.svg $OUTPUT
    echo "✅ Icone créée: $OUTPUT"
elif command -v cairosvg &> /dev/null; then
    cairosvg /tmp/icon-${SIZE}.svg -o $OUTPUT
    echo "✅ Icone créée: $OUTPUT"
else
    echo "⚠️ ImageMagick ou cairosvg requis pour la conversion"
    echo "   Téléchargez les icônes depuis: https://www.iconfinder.com"
fi

rm /tmp/icon-${SIZE}.svg
