# Sistema de Cache Inteligente para Documentos Pesados

## 📋 Descrição

Projeto acadêmico que implementa o **Proxy Pattern** (padrão estrutural) em JavaScript para otimizar o carregamento de documentos pesados através de um sistema inteligente de cache.

## 🎯 Objetivo

Demonstrar a aplicação prática do Proxy Pattern, permitindo:
- ✅ Interceptação de requisições
- ✅ Verificação de cache
- ✅ Evitar downloads repetidos
- ✅ Otimizar desempenho do sistema

## 🏗️ Estrutura do Projeto

```
projeto-proxy/
├── src/
│   ├── interfaces/
│   │   └── DocumentInterface.js    → Contrato de operações
│   ├── real/
│   │   └── RealDocument.js         → Carregamento real
│   ├── proxy/                      → Proxy do documento
│   ├── cache/                      → Gerenciamento de cache
│   └── app.js                      → Aplicação principal
├── docs/                           → Documentação e diagramas
├── README.md
├── .gitignore
└── package.json
```

## 🔧 Tecnologias

- **Linguagem**: JavaScript (Node.js)
- **Padrão**: Proxy Pattern (Structural)
- **IDE**: Visual Studio Code
- **Versionamento**: Git/GitHub

## 🚀 Como Usar

```bash
# Instalar dependências (se houver)
npm install

# Executar aplicação
npm start
```

## 📊 Fluxo do Sistema

```
Usuário → Proxy Documento → Cache Verificação → Documento Real → Servidor/Internet
```

## 👥 Equipe

- **PM (Project Manager)**: Gerenciamento geral e documentação
- **Desenvolvedor Backend**: Implementação de interfaces e RealDocument
- **Arquiteto de Sistemas**: Definição da arquitetura e UML
- **QA/Design**: Testes e validação de funcionamento

## 📋 Requisitos Funcionais

| Código | Requisito |
|--------|-----------|
| RF01   | Solicitar documentos |
| RF02   | Verificar cache |
| RF03   | Realizar download |
| RF04   | Armazenar cache |
| RF05   | Informar origem do arquivo |

## ✨ Status

- [x] Estrutura de pastas criada
- [ ] Arquitetura UML definida
- [ ] Interfaces implementadas
- [ ] Documento Real implementado
- [ ] Proxy implementado
- [ ] Cache funcional
- [ ] Testes validados
- [ ] Documentação final

## 📝 Notas

Este é um projeto educacional focado em demonstrar conceitos de Design Patterns e Engenharia de Software.

---

**Última atualização**: 20 de maio de 2026
