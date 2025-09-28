# Configuração Automática de Ambiente por Branch

Este projeto está configurado para trocar automaticamente os arquivos de configuração do Angular baseado na branch do Git.

## 🚀 Instalação Automática

**O sistema é configurado automaticamente após o `npm install`!**

Quando você clonar o projeto e executar:
```bash
npm install
```

O sistema será automaticamente configurado e estará pronto para uso. Não precisa fazer nada mais!

## Como Funciona

Quando você faz `git checkout` para uma branch diferente, o sistema automaticamente:
- `dev` → Copia `environment.dev.ts` para `environment.ts` (localhost:8080)
- `teste` → Copia `environment.teste.ts` para `environment.ts` (API de testes)
- `prod` → Copia `environment.prod.ts` para `environment.ts` (API de produção)

## Configuração Manual (se necessário)

Se por algum motivo a configuração automática não funcionou, você pode executar manualmente:

```bash
bash setup-env-hooks.sh
```

### 1. Hook do Git
Certifique-se de que o arquivo `.git/hooks/post-checkout` existe e é executável:

```bash
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
```

### 2. Configuração do Git
Remover configurações do Husky se existirem:
```bash
git config --unset core.hooksPath
```

### 3. Arquivos de Ambiente
Os seguintes arquivos devem existir:
- `src/environments/environment.dev.ts` - Desenvolvimento
- `src/environments/environment.teste.ts` - Testes  
- `src/environments/environment.prod.ts` - Produção
- `src/environments/environment.ts` - Gerado automaticamente (no .gitignore)

## Scripts Disponíveis

### Automático
```bash
git checkout dev    # Ativa automaticamente ambiente de desenvolvimento
git checkout teste  # Ativa automaticamente ambiente de testes
git checkout prod   # Ativa automaticamente ambiente de produção
```

### Manual
```bash
bash switch-env.sh  # Executa manualmente baseado na branch atual
npm run build       # Executa switch-env.sh automaticamente (prebuild)
```

## Troubleshooting

Se o hook não estiver funcionando:

1. Verifique se o hook existe: `ls -la .git/hooks/post-checkout`
2. Verifique se não há configuração do Husky: `git config --get core.hooksPath`
3. Teste manual: `bash .git/hooks/post-checkout "" "" "1"`
4. Execute manualmente: `bash switch-env.sh`

## Vantagens

- ✅ Troca automática de ambiente ao mudar de branch
- ✅ Não precisa lembrar de configurar manualmente
- ✅ Evita erros de usar ambiente errado
- ✅ Funciona tanto no build quanto no desenvolvimento
- ✅ Compatível com Windows, Linux e macOS