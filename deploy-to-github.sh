#!/bin/bash

# Script para desplegar a GitHub Pages
echo "🚀 Iniciando despliegue a GitHub Pages..."

# Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
rm -rf .next out/

# Instalar dependencias si es necesario
echo "📦 Verificando dependencias..."
npm install

# Construir el proyecto
echo "🔨 Construyendo el proyecto..."
npm run build

# Verificar que el build fue exitoso
if [ ! -d "out" ]; then
    echo "❌ Error: El directorio 'out' no se creó. El build falló."
    exit 1
fi

# Agregar archivo .nojekyll para GitHub Pages
echo "📝 Agregando .nojekyll..."
touch out/.nojekyll

# Agregar todos los archivos del build
echo "📁 Agregando archivos al repositorio..."
git add -f out/

# Hacer commit
echo "💾 Haciendo commit..."
git commit -m "Deploy to GitHub Pages - $(date)"

# Hacer push a la rama principal
echo "⬆️ Subiendo a la rama principal..."
git push origin main

# Desplegar a la rama gh-pages
echo "🌐 Desplegando a GitHub Pages..."
git subtree push --prefix out origin gh-pages

echo "✅ ¡Despliegue completado!"
echo "🌍 Tu sitio debería estar disponible en: https://yoyofdr.github.io/carvuk-vehicle-recommender/"
echo ""
echo "📋 Notas importantes:"
echo "   - Asegúrate de que GitHub Pages esté configurado para usar la rama 'gh-pages'"
echo "   - Puede tomar unos minutos para que los cambios se reflejen"
echo "   - Si el diseño no se ve correcto, verifica la configuración de GitHub Pages en tu repositorio"