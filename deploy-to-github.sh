#!/bin/bash

# Script para desplegar en GitHub Pages
# Reemplaza TU_USUARIO con tu nombre de usuario de GitHub

echo "🚀 Iniciando despliegue a GitHub Pages..."

# Configurar el remote (reemplaza TU_USUARIO)
echo "⚙️ Configurando remote origin..."
echo "IMPORTANTE: Reemplaza TU_USUARIO con tu nombre de usuario de GitHub"
echo ""
echo "Ejecuta este comando:"
echo "git remote add origin https://github.com/TU_USUARIO/carvuk-vehicle-recommender.git"
echo ""
read -p "Presiona Enter cuando hayas ejecutado el comando..."

# Push al main branch
echo "📤 Pushing to main branch..."
git push -u origin main

# Crear y push la rama gh-pages
echo "📦 Creando rama gh-pages..."
git subtree push --prefix out origin gh-pages

echo "✅ ¡Despliegue completado!"
echo ""
echo "🌐 Tu sitio estará disponible en:"
echo "https://TU_USUARIO.github.io/carvuk-vehicle-recommender/"
echo ""
echo "📝 Ahora ve a GitHub > Settings > Pages y:"
echo "1. En 'Source', selecciona 'Deploy from a branch'"
echo "2. En 'Branch', selecciona 'gh-pages' y '/ (root)'"
echo "3. Haz clic en 'Save'"
echo ""
echo "⏰ El sitio puede tardar unos minutos en estar disponible."