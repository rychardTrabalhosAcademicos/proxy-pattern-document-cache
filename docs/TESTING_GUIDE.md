**Guia de Testes — Sistema Proxy Pattern / Cache de Documentos**

- **Objetivo:** orientar quem for executar os testes manuais do projeto para verificar comportamento de download, cache e não-sobrescrita de arquivos.

**Pré-requisitos:**
- Node.js v16+ (suporta ES Modules e `node:perf_hooks`).
- Repositório clonado e dependências (nenhuma externa necessária).
- Acesso à internet (para baixar arquivos públicos do Google Docs).

**Arquivos relevantes:**
- `src/app.js` — runner de demonstração / script de testes manuais.
- `src/real/RealDocument.js` — realiza download real e salva em `downloads/`.
- `src/proxy/ProxyDocument.js` — lógica de proxy + cache + cópia em cache.
- `src/cache/CacheManager.js` — gerenciador em memória (Map).
- `package.json` — scripts: `npm start`, `npm run start:urls`.

**Comandos úteis:**
- Executar com URLs padrão:

```bash
npm start
```

- Executar passando URLs (substitua pelas URLs de teste):

```bash
npm run start:urls -- <URL1> <URL2> ...
```

Exemplo:

```bash
npm run start:urls -- \
  "https://docs.google.com/document/d/ID1/edit?usp=sharing" \
  "https://docs.google.com/document/d/ID2/edit?usp=sharing"
```

**Fluxo de testes a executar (passo-a-passo):**
1. Limpar/inspecionar a pasta `downloads/` antes de começar (remover arquivos antigos para resultados limpos).
2. Rodar `npm start` (ou `npm run start:urls` com as URLs desejadas).
3. Observar o console e anotar os tempos e mensagens.

Para cada URL testada o script executa duas requisições sequenciais:
- Primeira: Cache MISS — o arquivo deve ser baixado do Google e salvo em `downloads/`.
- Segunda: Cache HIT — o arquivo deve **não ser baixado novamente**; em vez disso, o arquivo em cache será copiado para um novo arquivo (sufixo numérico) e esse caminho será retornado.

**Critérios de verificação (o que confirmar):**
- Para cada URL, após a execução, devem existir dois arquivos no diretório `downloads/` relacionados ao documento: o original (baixado no MISS) e uma cópia com sufixo (ex.: `nome (1).docx`) gerada no HIT.
- O console deve mostrar mensagens claras:
  - "✗ Não encontrado em cache. Delegando ao RealDocument..." quando for MISS
  - "✓ Encontrado em cache: <caminho>" e "Cópia de cache criada: <caminho>" quando for HIT
- Os tempos reportados devem mostrar que o HIT é significativamente mais rápido que o MISS (normalmente <1ms vs centenas de ms).
- Arquivos nunca devem ser sobrescritos; se rodar o script novamente, novos sufixos devem ser gerados (` (1)`, ` (2)`, ...).

**Casos de erro para testar (com comportamento esperado):**
- URL inválida / sem `fileId`: o programa deve lançar erro com mensagem: "Nao foi possivel extrair o fileId da URL informada." (ou similar).
- Documento não público (restrito): o Google tende a retornar HTML em vez do arquivo; o programa deve detectar `content-type: text/html` e lançar erro informando que o arquivo pode não estar público.

**Checklist de aceitação (marcar ao finalizar):**
- [ ] 1. `npm start` executa sem exceções
- [ ] 2. Para cada documento testado: existe `nome.docx` (MISS)
- [ ] 3. Para cada documento testado: existe `nome (1).docx` (HIT)
- [ ] 4. Console contém logs de MISS/HIT e caminhos dos arquivos
- [ ] 5. Medições de tempo indicam ganho com cache (HIT << MISS)
- [ ] 6. Re-execução do script adiciona sufixos sem sobrescrever
- [ ] 7. Erros em URLs inválidas aparecem com mensagens úteis

**Artefatos a coletar para relatório:**
- Saída do console (copiar/colar)
- Listagem do diretório `downloads/` após execução (`ls -la downloads`)
- Captura de tela dos arquivos gerados (opcional)

**Observações / notas para avaliador:**
- O cache é mantido em memória enquanto o processo estiver ativo. Reiniciar o processo limpa a memória, mas os arquivos persistem em `downloads/`.
- A implementação prioriza simplicidade e compreensibilidade (projeto acadêmico). Para ambientes de produção seria recomendado: chave de cache normalizada por `fileId`, TTL/invalidação, armazenamento persistente (Redis/FS) e tratamento de quotas do Google Drive via API oficial.

---
Documento gerado automaticamente para orientar os testes manuais. Se quiser, eu adapto a checklist para um script de verificação automática simples (ex.: um pequeno Node.js que valida a presença dos arquivos e logs).