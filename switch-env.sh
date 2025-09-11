#!/usr/bin/env bash

branch=$(git rev-parse --abbrev-ref HEAD)

echo "🔁 Branch atual: '$branch'"
echo "🔧 Atualizando o ambiente do Angular..."

case "$branch" in
  dev)
    cp src/environments/environment.dev.ts src/environments/environment.ts
    echo "✅ Ambiente de Desenvolvimento ativado."
    ;;
  teste | test)
    cp src/environments/environment.teste.ts src/environments/environment.ts
    echo "✅ Ambiente de Testes ativado."
    ;;
  prod | production)
    cp src/environments/environment.prod.ts src/environments/environment.ts
    echo "✅ Ambiente de Produção ativado."
    ;;
  *)
    echo "⚠️ Nenhum ambiente correspondente para a branch '$branch'. Nenhuma alteração feita."
    ;;
esac
