# RF Client Hub

Crie uma aplicação web completa de gestão de clientes para tráfego pago chamada "RF Client Manager".

O visual deve ser moderno, escuro e profissional, usando tons de preto, cinza escuro e dourado (#d4af37).

Estrutura da aplicação:

1. **Sidebar (menu lateral esquerdo)**:

   - Logo RF MULTIMARCAS

   - Dashboard

   - Meus Clientes

   - Adicionar Cliente

2. **Página Principal (Dashboard)**:

   - Cards no topo mostrando:

     - Total de Clientes

     - Clientes Ativos

     - Clientes Inativos

     - Faturamento Mensal Estimado

3. **Seção "Meus Clientes"**:

   - Barra de busca

   - Filtro por Status (Todos, Ativos, Inativos)

   - Lista de clientes em cards ou tabela bonita

Cada cliente deve ter:

   - Nome do Cliente (ex: Loja da Maria)

   - Status: Toggle grande e visível (Ativo = Verde / Inativo = Vermelho)

   - Responsável (dropdown: Aloan, Auxiliar, etc)

   - Investimento Mensal (R$)

   - Plataformas (Meta Ads, Google Ads, TikTok Ads - múltipla seleção)

   - Última Atualização (data automática)

   - Observações / Demandas (campo de texto grande)

   - Botão de Editar e Excluir

Funcionalidades obrigatórias:

- Adicionar novo cliente com formulário

- Editar cliente

- Salvar os dados (use Supabase ou banco local)

- Design totalmente responsivo

- Modo escuro elegante

- Botões e toggles com efeito hover premium

Quero que fique bem organizado, bonito e fácil de usar para gerenciamento diário.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dc9b9251-f17f-4dbe-9d9d-acc721437e5f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
