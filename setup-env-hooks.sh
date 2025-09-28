#!/bin/bash

# Script para configurar a troca automática de environment por branch
# Executado automaticamente após npm install
echo ""
echo "🔧 Configurando troca automática de environment por branch..."

# Verificar se estamos em um repositório Git
if [ ! -d ".git" ]; then
    echo "❌ Não é um repositório Git. Pulando configuração de hooks."
    exit 0
fi

# Verificar se o hook já existe e está atualizado
HOOK_FILE=".git/hooks/post-checkout"
if [ -f "$HOOK_FILE" ]; then
    if grep -q "Ambiente de Desenvolvimento ativado (localhost:8080)" "$HOOK_FILE" 2>/dev/null; then
        echo "✅ Hook post-checkout já está configurado e atualizado."
        # Executar para a branch atual mesmo se já existe
        bash "$HOOK_FILE" "" "" "1" 2>/dev/null || true
        echo "✅ Configuração de environment automática está ativa!"
        echo ""
        exit 0
    fi
fi

# Criar o diretório de hooks se não existir
mkdir -p .git/hooks

# Criar o hook post-checkout
cat > "$HOOK_FILE" << 'EOF'
#!/usr/bin/env bash

# Hook post-checkout para trocar automaticamente o environment do Angular
# Parâmetros do hook: $1=ref anterior, $2=ref novo, $3=flag (1 para checkout de branch)

# Só executa se for um checkout de branch (não de arquivo)
if [ "$3" = "1" ]; then
    branch=$(git rev-parse --abbrev-ref HEAD)
    
    echo "🔄 Trocando para a branch '$branch'. Atualizando o ambiente do frontend..."
    
    case "$branch" in
        dev)
            cp src/environments/environment.dev.ts src/environments/environment.ts
            echo "✅ Ambiente de Desenvolvimento ativado (localhost:8080)."
            ;;
        prod|production)
            cp src/environments/environment.prod.ts src/environments/environment.ts
            echo "✅ Ambiente de Produção ativado."
            ;;
        teste|test)
            cp src/environments/environment.teste.ts src/environments/environment.ts
            echo "✅ Ambiente de Testes ativado."
            ;;
        *)
            echo "⚠️ Nenhum ambiente correspondente para a branch '$branch'. Mantendo configuração atual."
            ;;
    esac
fi

exit 0
EOF

# Tornar o hook executável
chmod +x "$HOOK_FILE"

# Remover configuração do Husky se existir
git config --unset core.hooksPath 2>/dev/null || true

# Executar para a branch atual
echo "🔄 Configurando ambiente para a branch atual..."
bash "$HOOK_FILE" "" "" "1" 2>/dev/null || true

echo "✅ Configuração concluída!"
echo "✅ A troca de ambiente será automática ao fazer checkout de branches:"
echo "   • dev → Desenvolvimento (localhost:8080)"
echo "   • teste → Testes (API remota)"  
echo "   • prod → Produção (API remota)"
echo ""