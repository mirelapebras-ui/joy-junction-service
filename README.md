# Camélia Estética — Sistema de Agendamento

Protótipo de sistema de agendamento para uma clínica de estética, com três perfis de
acesso: **cliente**, **recepção** e **profissional**. O projeto foi construído para fins
acadêmicos e guarda os dados no próprio navegador (localStorage), sem banco de dados real.

**Aplicação no ar**: https://joy-junction-service.lovable.app

## O que o sistema faz

### Cliente
- Cria cadastro com nome, CPF, data de nascimento, telefone e senha
- Consulta a disponibilidade de cada profissional por dia e horário
- Agenda sessão avulsa ou sessão de pacote
- Remarca ou cancela as próprias sessões
- Acompanha os pacotes que possui e o saldo de sessões

### Recepção
- Vê a agenda geral, com as sessões de todos os profissionais
- Busca cliente pelo CPF e vende pacotes de sessões
- Registra pagamentos parciais e acompanha o valor em aberto
- Consulta o financeiro do mês: recebido, a receber, gráfico dos últimos 6 meses,
  divisão por forma de pagamento e exportação em CSV
- Cancela qualquer sessão, mesmo com o horário já passado

### Profissional
- Vê a própria agenda
- Registra o atendimento realizado
- Não acessa as demais áreas do sistema

## Regras de negócio

| Regra | Detalhe |
| --- | --- |
| CPF único | Não é permitido cadastrar dois clientes com o mesmo CPF |
| Sem conflito de horário | Um profissional não pode ter duas sessões no mesmo dia e horário |
| Antecedência de 2 horas | A cliente só remarca ou cancela com pelo menos 2 horas de antecedência |
| Exceção para a recepção | A recepção pode cancelar a qualquer momento, mesmo depois do horário |
| Saldo de pacote | Sessão de pacote só é agendada se houver saldo disponível |
| Cancelar devolve o saldo | Cancelar sessão de pacote devolve a sessão ao saldo |
| Pagamento limitado | O pagamento registrado não pode ultrapassar o valor total do pacote |
| Atendimento restrito | Apenas o profissional responsável pela sessão registra o atendimento |

## Como rodar no computador

Pré-requisito: [Node.js](https://nodejs.org) instalado.

```sh
npm install
npm run dev
```

Abra no navegador o endereço que aparecer no terminal (normalmente
`http://localhost:8080`).

No Windows, se o PowerShell recusar o `npm`, troque o terminal do VSCode para
**Command Prompt** ou execute uma vez:
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## Acessos de demonstração

Os dados de exemplo são criados automaticamente na primeira abertura.

| Perfil | Login | Senha |
| --- | --- | --- |
| Cliente | `111.111.111-11` (Ana Paula Ribeiro) | `123456` |
| Cliente | `222.222.222-22` (Júlia Martins) | `123456` |
| Recepção | `secretaria` | `123456` |
| Profissional | `Bianca Rocha`, `Rafael Souza` ou `Camila Duarte` | `123456` |

## Procedimentos cadastrados

| Procedimento | Duração | Valor |
| --- | --- | --- |
| Limpeza de Pele | 60 min | R$ 150,00 |
| Depilação a Laser | 40 min | R$ 200,00 |
| Massagem Modeladora | 50 min | R$ 180,00 |

## Estrutura do código

```
src/
  lib/
    db.ts               regras de negócio, dados de exemplo e armazenamento
    contact.ts          montagem da mensagem de contato
    contact.test.ts     teste do destino do contato
  routes/
    index.tsx           página inicial
    procedimentos.tsx   catálogo de procedimentos
    acesso.tsx          entrada e cadastro
    cliente.tsx         área da cliente
    secretaria.tsx      área da recepção
    profissional.tsx    área do profissional
    __root.tsx          layout compartilhado e metadados
  components/
    camelia.tsx         casca do sistema, menu lateral e blocos visuais
    disponibilidade.tsx lista de horários livres
    home-content.tsx    depoimentos e dúvidas da página inicial
    home-contact.tsx    formulário de contato
  styles.css            identidade visual (cores, fontes, animações)
```

## Ferramentas

- [TanStack Start](https://tanstack.com/start) (React 19 + Vite)
- TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Recharts](https://recharts.org) para o gráfico do financeiro
- Dados no navegador via `localStorage`, sem servidor nem banco de dados

## Como testar

Os testes usam o [Bun](https://bun.sh). Com ele instalado, na pasta do projeto:

```sh
bun test src/lib
```

`src/lib/db.test.ts` confere as regras de negócio:

- CPF não pode se repetir
- Um profissional não pode ter duas sessões no mesmo dia e horário
- A cliente precisa de 2 horas de antecedência para cancelar
- A recepção pode cancelar mesmo depois do horário
- Pacote sem saldo não agenda sessão
- Cancelar sessão de pacote devolve o saldo
- Pagamento não pode ultrapassar o valor total
- Só o profissional responsável registra o atendimento
