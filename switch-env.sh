#!/usr/bin/env bash

branch=$(git rev-parse --abbrev-ref HEAD)

echo "A trocar para a branch '$branch'. A atualizar o ambiente do frontend..."

if [ "$branch" = "master" ] || [ "$branch" = "main" ]; then
    echo "Ambiente de Desenvolvimento ativado. Nenhuma alteração necessária."
elif [ "$branch" = "prod" ]; then
    cp src/environments/environment.prod.ts src/environments/environment.ts
    echo "Ambiente de Produção ativado."
elif [ "$branch" = "test" ] || [ "$branch" = "teste" ]; then
    cp src/environments/environment.test.ts src/environments/environment.ts
    echo "Ambiente de Testes ativado."
else
    echo "Nenhum ambiente correspondente para a branch '$branch'. Nenhuma alteração feita."
fi
