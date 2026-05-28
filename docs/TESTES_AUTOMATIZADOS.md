# Testes Automatizados - Proxy Pattern com Cache

## Objetivo

Os testes automatizados foram implementados para validar o funcionamento do sistema Proxy Pattern com cache, garantindo o correto comportamento das requisições, armazenamento em cache e integração entre os componentes.

---

# Estrutura dos Testes

Os testes foram organizados na pasta:

```txt
tests/
```

Contendo os seguintes arquivos:

```txt
tests/
├── cache.test.js
├── proxy.test.js
└── integration.test.js
```

Cada arquivo possui uma responsabilidade específica.

---

# cache.test.js

Responsável por testar o funcionamento do gerenciador de cache (`CacheManager`).

## Cenários testados

* armazenamento de arquivos no cache;
* verificação de existência;
* recuperação de arquivos armazenados;
* separação correta entre diferentes documentos.

## Objetivo

Garantir que o sistema de cache funcione corretamente antes de ser utilizado pelo Proxy.

---

# proxy.test.js

Responsável por testar diretamente o comportamento do `ProxyDocument`.

## Cenários testados

### Primeira requisição

Verifica se:

* o Proxy detecta ausência no cache;
* o `RealDocument` é acionado;
* o documento é armazenado no cache;
* a resposta retorna como `[Servidor]`.

### Segunda requisição

Verifica se:

* o Proxy detecta o documento em cache;
* o download não é realizado novamente;
* a resposta retorna como `[Cache]`.

### Requisições repetidas

Verifica se:

* múltiplas chamadas não geram downloads adicionais;
* o cache realmente evita processamento desnecessário.

---

# integration.test.js

Responsável pelos testes de integração do fluxo completo do sistema.

## Cenários testados

* fluxo completo entre Proxy + Cache + RealDocument;
* funcionamento conjunto dos componentes;
* armazenamento independente de múltiplos arquivos;
* reutilização correta do cache.

## Objetivo

Garantir que todas as partes do sistema funcionem corretamente em conjunto.

---

# Uso de Fake Objects

Durante os testes automatizados, não foi utilizado o download real de arquivos da internet.

Foi criado um objeto simulador chamado:

```js
FakeRealDocument
```

Esse objeto simula o comportamento do `RealDocument`, criando arquivos locais temporários em vez de realizar downloads reais.

---

# Por que não utilizar download real nos testes?

Utilizar downloads reais tornaria os testes:

* lentos;
* instáveis;
* dependentes de internet;
* dependentes do Google Drive;
* suscetíveis a falhas externas.

Exemplos de problemas:

* queda de conexão;
* links expirados;
* alterações externas nos arquivos;
* limitação de requisições;
* instabilidade de rede.

Esses fatores poderiam causar falhas nos testes mesmo quando o código estivesse correto.

---

# Benefícios do uso de Fakes

Ao utilizar objetos simulados, os testes se tornaram:

* rápidos;
* previsíveis;
* reproduzíveis;
* independentes de internet;
* mais seguros;
* mais fáceis de manter.

Essa abordagem segue boas práticas de Engenharia de Software e Quality Assurance (QA).

---

# Injeção de Dependência

Para permitir o uso de objetos simulados, o `ProxyDocument` foi adaptado para receber dependências externas no construtor.

Antes:

```js
this._realDocument = new RealDocument();
```

Depois:

```js
constructor(realDocument, cache)
```

Isso permitiu:

* desacoplamento;
* maior flexibilidade;
* melhor testabilidade;
* substituição do objeto real por objetos fake durante os testes.

---

# Ferramenta Utilizada

Os testes automatizados foram desenvolvidos utilizando:

* Node.js
* Jest

Instalação:

```bash
npm install --save-dev jest
```

Execução:

```bash
npm test
```

---

# Resultado dos Testes

Execução final:

```txt
PASS tests/proxy.test.js
PASS tests/integration.test.js
PASS tests/cache.test.js

Test Suites: 3 passed
Tests: 8 passed
```

Todos os testes foram executados com sucesso.

---

# Conclusão

Os testes automatizados comprovaram o funcionamento correto do sistema Proxy com cache, validando:

* interceptação de requisições;
* reutilização de documentos em cache;
* redução de downloads desnecessários;
* integração correta entre os componentes;
* funcionamento completo do Proxy Pattern.

Além disso, a utilização de testes automatizados aumentou a confiabilidade, qualidade e manutenção do projeto.
