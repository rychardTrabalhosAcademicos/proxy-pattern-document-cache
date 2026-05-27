/**
 * Aplicação Principal - Sistema de Cache Inteligente para Documentos Pesados
 * Padrão: Proxy Pattern
 *
 * Fluxo:
 * Cliente → ProxyDocument → CacheManager → RealDocument → Servidor/Internet
 */

import { ProxyDocument } from './proxy/ProxyDocument.js';

async function main() {
  console.log('=== Projeto Proxy Pattern - Sistema de Cache de Documentos ===\n');

  const proxy = new ProxyDocument();

  // Cenário 1: Primeira requisição (Cache MISS)
  // O RealDocument será acionado, simulando 2.5s de latência de rede
  console.log('├─ Requisição 1: relatorio-anual.pdf');
  console.log('└─ Esperado: Cache MISS (servidor acionado)');
  const startTime1 = Date.now();
  const doc1 = await proxy.download('relatorio-anual.pdf');
  const duration1 = Date.now() - startTime1;
  console.log(`   Resultado: ${doc1}`);
  console.log(`   ⏱️  Tempo: ${duration1}ms\n`);

  // Cenário 2: Requisição repetida (Cache HIT)
  // O documento deve ser retornado do cache instantaneamente
  console.log('├─ Requisição 2: relatorio-anual.pdf (repetida)');
  console.log('└─ Esperado: Cache HIT (retorna imediatamente)');
  const startTime2 = Date.now();
  const doc2 = await proxy.download('relatorio-anual.pdf');
  const duration2 = Date.now() - startTime2;
  console.log(`   Resultado: ${doc2}`);
  console.log(`   ⏱️  Tempo: ${duration2}ms\n`);

  // Cenário 3: Novo arquivo (Cache MISS)
  // RealDocument será novamente acionado para este arquivo diferente
  console.log('├─ Requisição 3: manual-tecnico.pdf');
  console.log('└─ Esperado: Cache MISS (arquivo novo)');
  const startTime3 = Date.now();
  const doc3 = await proxy.download('manual-tecnico.pdf');
  const duration3 = Date.now() - startTime3;
  console.log(`   Resultado: ${doc3}`);
  console.log(`   ⏱️  Tempo: ${duration3}ms\n`);

  // Resumo: economia de tempo com cache
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('RESUMO - Benefício do Proxy Pattern com Cache:');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`Requisição 1 (Servidor):  ${duration1}ms`);
  console.log(`Requisição 2 (Cache):     ${duration2}ms  ← ${((1 - duration2/duration1) * 100).toFixed(1)}% mais rápido!`);
  console.log(`Requisição 3 (Servidor):  ${duration3}ms`);
  console.log(`\n✓ Total economizado: ${duration1 + duration3 - duration2}ms (aproximadamente)`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('Erro na execução:', err.message);
  process.exit(1);
});
