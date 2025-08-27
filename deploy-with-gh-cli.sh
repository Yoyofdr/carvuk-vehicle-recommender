#!/bin/bash

# Script para desplegar usando GitHub CLI (después de autenticar)

echo "🔐 Verificando autenticación de GitHub CLI..."

if ! gh auth status > /dev/null 2>&1; then
    echo "❌ No estás autenticado en GitHub CLI."
    echo "🔑 Por favor auténticate primero:"
    echo ""
    echo "1. Ejecuta: gh auth login --web"
    echo "2. Usa el código que aparezca"
    echo "3. Ve a: https://github.com/login/device"
    echo "4. Pega el código y autoriza"
    echo ""
    echo "Después ejecuta este script nuevamente."
    exit 1
fi

echo "✅ GitHub CLI autenticado correctamente"
echo ""
echo "🚀 Creando repositorio en GitHub..."

# Crear repositorio y hacer push
gh repo create carvuk-vehicle-recommender --public --source=. --remote=origin --push

echo "📦 Desplegando a GitHub Pages usando GitHub Actions..."
echo ""
echo "✅ ¡Repositorio creado!"
echo ""
echo "🌐 Tu sitio estará disponible en:"
gh repo view --web

echo ""
echo "📝 Configuración automática de GitHub Pages:"
echo "- Ve a Settings > Pages"
echo "- GitHub Actions ya está configurado como fuente"
echo "- El despliegue se activará automáticamente"
echo ""
echo "⏰ El sitio puede tardar unos minutos en estar disponible."