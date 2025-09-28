# Loja - Sistema de E-commerce Angular

Sistema de e-commerce desenvolvido com Angular 13, com configuração automática de ambientes por branch.

## 🚀 Instalação Rápida

```bash
git clone <repo-url>
cd loja-ng
npm install
```

**Pronto!** O sistema de troca automática de ambiente já está configurado. ✨

## 🔄 Ambientes Automáticos

O sistema automaticamente configura o ambiente baseado na branch:

- **`dev`** → Desenvolvimento (localhost:8080)
- **`teste`** → Testes (API remota) 
- **`prod`** → Produção (API remota)

Basta fazer `git checkout <branch>` e o environment será trocado automaticamente!

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
