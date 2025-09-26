#!/usr/bin/env bash

if [ -z "$BRANCH" ]; then
    branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
else
    branch=$BRANCH
fi

echo "��� Branch atual detectada: '$branch'"
echo "⚙️  Atualizando o ambiente Angular..."

case "$branch" in
  dev)
    cp src/environments/environment.dev.ts src/environments/environment.ts
    echo "✅ Ambiente de Desenvolvimento ativado."
    ;;
  teste | test)
    cp src/environments/environment.teste.ts src/environments/environment.ts
    echo "✅ Ambiente de Testes ativado."
    ;;
  prod | production | main | master)
    cp src/environments/environment.prod.ts src/environments/environment.ts
    echo "✅ Ambiente de Produção ativado."
    ;;
  *)
    echo "⚠️ Nenhum ambiente correspondente para a branch '$branch'. Nenhuma alteração feita."
    exit 1
    ;;
esac

exit 0
