# Desafio Grupo Adriano Cobbucio

O objetivo consiste na criação de uma carteira financeira em que os usuários possam realizar
transferência de saldo.
Teremos apenas um tipo de usuário que pode enviar ou receber dinheiro de qualquer outro.

## Pré Requisitos

- **Node.js** (recomendado: >= 18.x) - Dê preferencia para a versão 18.16.0 para desenvolvimento
- **npm** (Vem junto com o pacote do node) 9.5.1
- **Docker** e **Docker Compose**
- **Git** (Pro versionamento e clone do repositório)

## Dependências

1. **Clonando o repositório:**

    ```bash
    git clone <repository-url>
    cd desafio_grupo_adriano_cobuccio
    ```

2. **Definindo variáveis de ambiente:**
   Copie o `.env.example` para `.env.dev` e preencha com os valores de acordo com sua necessidade.

## Documentação das rotas
Documentação Swagger disponível em `http://localhost:<porta>/docs` após iniciar a aplicação

## Rodando toda a aplicação com docker

**Iniciando toda a aplicação**
```bash
docker compose --env-file .env.dev up
```

## Rodando o banco no docker e a aplicação localmente

**Iniciando o docker para uso do banco**
```bash
docker-compose --env-file .env.dev up postgres-service -d
```A

**Instalando dependências**
```bash
npm ci
```

No arquivo .env.dev troque "postgres-service" por "localhost"

**Rodando a aplicação em desenvolvimento(linux):**
```bash
npm run start:dev
```

**Rodando a aplicação em desenvolvimento(Windows):**
```bash
npm run start:dev:w
```

## Scripts principais
Para separação dos ambientes e evitar erros, é setado um NODE_ENV via script, o mesmo é setado de maneiras diferentes no windows e no linux, por isso a separação
> **No windows, Acrescente `:w` no final do comando.**  
> Exemplo: `npm run start:dev:w`

- `npm run start` Inicia a aplicação no modo de produção
- `npm run start:dev` Inicia a aplicação no modo de desenvolvimento


Credencial de admin:

email: `admin@example.com`,
password: `adminpass`,
