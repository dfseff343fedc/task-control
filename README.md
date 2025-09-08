# 📋 Task Control API

> Uma API REST robusta para gerenciamento de tarefas construída com **TypeScript puro** e **Clean Architecture**, sem dependências externas de frameworks.

![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)
![Node.js](https://img.shields.io/badge/Node.js->=18-green)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-brightgreen)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

---

## 🎯 **Sobre o Projeto**

O **Task Control** é uma aplicação backend que demonstra a implementação de **Clean Architecture** e **Domain-Driven Design (DDD)** usando apenas **Node.js nativo** e **TypeScript**.

### ✨ **Características Principais**

- 🚫 **Zero dependências externas** de frameworks (apenas dev dependencies)
- 🏗️ **Clean Architecture** com separação clara de responsabilidades
- 🔷 **Domain-Driven Design** com entidades e casos de uso bem definidos
- 📦 **TypeScript** com configurações rigorosas e type safety
- 🗄️ **Banco de dados em JSON** com persistência automática
- 🔄 **API REST completa** com CRUD de tarefas
- ⚡ **Hot reload** para desenvolvimento
- 🎯 **Arquitetura testável** e desacoplada

---

## 🏗️ **Arquitetura do Projeto**

O projeto segue os princípios da **Clean Architecture** de Robert C. Martin, organizado em camadas bem definidas:

```
src/
├── 🏢 domain/           # Camada de Domínio
├── 💼 application/      # Camada de Aplicação
├── 🔧 infrastructure/   # Camada de Infraestrutura
├── 🌐 presentation/     # Camada de Apresentação
└── 📦 shared/          # Recursos Compartilhados
```

### 📋 **Responsabilidades das Camadas**

#### 🏢 **Domain (Domínio)**

- **Responsabilidade**: Contém as regras de negócio centrais
- **Componentes**:
  - **Entities**: Entidade `Task` com validações e métodos de negócio
  - **Repositories**: Interface `ITaskRepository` definindo contratos
  - **Value Objects**: Objetos de valor do domínio
  - **Domain Services**: Serviços específicos do domínio

#### 💼 **Application (Aplicação)**

- **Responsabilidade**: Orquestração dos casos de uso da aplicação
- **Componentes**:
  - **Use Cases**: Casos de uso implementados (Create, List, Update, Delete, Toggle)
  - **DTOs**: Data Transfer Objects para comunicação entre camadas
  - **Interfaces**: Contratos de serviços externos

#### 🔧 **Infrastructure (Infraestrutura)**

- **Responsabilidade**: Implementação de detalhes técnicos
- **Componentes**:
  - **Database**: Sistema de banco de dados em JSON
  - **Repositories**: Implementação concreta do `TaskRepository`
  - **HTTP Server**: Servidor HTTP nativo com middlewares
  - **External Services**: Integrações externas

#### 🌐 **Presentation (Apresentação)**

- **Responsabilidade**: Interface de comunicação (API REST)
- **Componentes**:
  - **Controllers**: Controladores HTTP (`TaskController`)
  - **Routes**: Definição de rotas e endpoints
  - **Middlewares**: Middlewares de requisição

#### 📦 **Shared (Compartilhado)**

- **Responsabilidade**: Recursos utilizados por múltiplas camadas
- **Componentes**:
  - **Types**: Tipos TypeScript compartilhados
  - **Utils**: Utilitários e helpers
  - **Factories**: Factories para injeção de dependência

---

## 🚀 **Funcionalidades**

### 📋 **CRUD Completo de Tarefas**

- ✅ **Criar** tarefa com validações
- 📖 **Listar** tarefas com filtros e paginação
- ✏️ **Atualizar** tarefa parcial ou totalmente
- 🗑️ **Excluir** tarefa
- 🔄 **Alternar** status de completada

### 🔍 **Recursos Avançados**

- 🔍 Busca por termo (título e descrição)
- 📄 Paginação configurável
- 🗂️ Filtros por status e data de criação
- 📊 Ordenação por diferentes campos
- 📈 Contagem total de registros
- ⚡ Validação de duplicatas

---

## 🛠️ **Tecnologias Utilizadas**

### **Core**

- **TypeScript 5.9.2** - Linguagem principal
- **Node.js >=18** - Runtime JavaScript

### **Configurações**

- **ESModules** - Sistema de módulos moderno
- **Strict TypeScript** - Configurações rigorosas
- **Path Mapping** - Imports limpos com aliases
- **Source Maps** - Debug facilitado

### **Dependências de Desenvolvimento**

```json
{
  "@types/node": "^24.3.1",
  "rimraf": "^6.0.1",
  "ts-node": "^10.9.2",
  "typescript": "^5.9.2"
}
```

---

## 📡 **Endpoints da API**

### **Health Check**

```http
GET /health
```

### **Tarefas**

```http
POST   /tasks              # Criar tarefa
GET    /tasks              # Listar tarefas (com filtros)
PUT    /tasks/:id          # Atualizar tarefa
DELETE /tasks/:id          # Excluir tarefa
PATCH  /tasks/:id/complete # Alternar status de completada
```

### **Exemplo de Uso**

**Criar uma tarefa:**

```bash
curl -X POST http://localhost:3333/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Estudar Clean Architecture",
    "description": "Implementar projeto seguindo os princípios da Clean Architecture"
  }'
```

**Listar tarefas com filtros:**

```bash
curl "http://localhost:3333/tasks?completed=false&search=estudar&page=1&limit=10"
```

---

## 🚀 **Como Executar o Projeto**

### **Pré-requisitos**

- Node.js >= 18
- npm ou yarn

### **1. Clone o repositório**

```bash
git clone https://github.com/maykonsousa/task-control.git
cd task-control
```

### **2. Instale as dependências**

```bash
npm install
```

### **3. Execute em modo de desenvolvimento**

```bash
npm run dev
```

### **4. Execute em produção**

```bash
# Compilar o projeto
npm run build

# Executar a versão compilada
npm start
```

### **5. Scripts disponíveis**

```bash
npm run dev        # Desenvolvimento com hot reload
npm run build      # Compilar TypeScript para JavaScript
npm start          # Executar versão compilada
npm run clean      # Limpar pasta dist
npm run type-check # Verificar tipos sem compilar
```

---

## 📁 **Estrutura de Arquivos**

```
task-control/
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 db.json           # Banco de dados JSON
├── 📁 dist/             # Código compilado
├── 📁 node_modules/     # Dependências
└── 📁 src/
    ├── 📄 server.ts     # Ponto de entrada
    ├── 📁 domain/       # Regras de negócio
    │   ├── 📁 entities/
    │   ├── 📁 repositories/
    │   └── 📁 services/
    ├── 📁 application/   # Casos de uso
    │   ├── 📁 use-cases/
    │   └── 📁 dtos/
    ├── 📁 infrastructure/ # Detalhes técnicos
    │   ├── 📁 database/
    │   ├── 📁 http/
    │   └── 📁 repositories/
    ├── 📁 presentation/  # Interface HTTP
    │   ├── 📁 controllers/
    │   └── 📁 routes/
    └── 📁 shared/       # Recursos compartilhados
        ├── 📁 factories/
        ├── 📁 types/
        └── 📁 utils/
```

---

## 🧪 **Testando a API**

### **Health Check**

```bash
curl http://localhost:3333/health
```

### **Criar primeira tarefa**

```bash
curl -X POST http://localhost:3333/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Minha primeira tarefa",
    "description": "Testando a API de controle de tarefas"
  }'
```

---

## 🎯 **Princípios Aplicados**

### **Clean Architecture**

- **Independência de frameworks** - Sem dependência de libs externas
- **Testabilidade** - Código desacoplado e injetável
- **Independência de UI** - Lógica separada da apresentação
- **Independência de banco** - Repository pattern
- **Regra de dependência** - Dependências apontam para dentro

### **Domain-Driven Design**

- **Ubiquitous Language** - Linguagem comum do domínio
- **Entities** - Objetos com identidade
- **Value Objects** - Objetos sem identidade
- **Domain Services** - Serviços do domínio
- **Repository Pattern** - Abstração de persistência

### **SOLID Principles**

- **S** - Single Responsibility Principle
- **O** - Open/Closed Principle
- **L** - Liskov Substitution Principle
- **I** - Interface Segregation Principle
- **D** - Dependency Inversion Principle

---

## 💡 **Por que essa abordagem?**

### **🚫 Zero Dependencies Approach**

- **Performance** - Menos overhead de bibliotecas
- **Segurança** - Menor superfície de ataque
- **Controle** - Total controle sobre o código
- **Aprendizado** - Entendimento profundo do Node.js

### **🏗️ Clean Architecture Benefits**

- **Manutenibilidade** - Código organizado e limpo
- **Testabilidade** - Fácil de testar cada camada
- **Flexibilidade** - Fácil de trocar implementações
- **Escalabilidade** - Estrutura para crescimento

---

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 **Autor**

**Maykon Sousa**

- GitHub: [@maykonsousa](https://github.com/maykonsousa)
- LinkedIn: [Maykon Sousa](https://linkedin.com/in/maykonsousa)

---

<div align="center">

### 🚀 **Desenvolvido com TypeScript e Clean Architecture**

**[⭐ Star este repositório se foi útil para você!]**

</div>
