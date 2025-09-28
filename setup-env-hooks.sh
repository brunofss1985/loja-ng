#!/bin/bash

# Script para configurar a troca automática de environment por branch
echo "🔧 Configurando troca automática de environment..."

# Criar o hook post-checkout
cat > .git/hooks/post-checkout << 'EOF'
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
chmod +x .git/hooks/post-checkout

# Remover configuração do Husky se existir
git config --unset core.hooksPath 2>/dev/null || true

# Executar para a branch atual
bash .git/hooks/post-checkout "" "" "1"

echo "✅ Configuração concluída!"
echo "Agora a troca de ambiente será automática ao fazer checkout de branches."