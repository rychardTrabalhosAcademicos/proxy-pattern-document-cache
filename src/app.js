/**
 * Aplicação Principal - Sistema de Cache Inteligente para Documentos Pesados
 * Padrão: Proxy Pattern
 *
 * Fluxo:
 * Cliente → ProxyDocument → CacheManager → RealDocument → Servidor/Internet
 */

import { ProxyDocument } from './proxy/ProxyDocument.js';
import { performance } from 'node:perf_hooks';

function formatMs(value) {
  return `${value.toFixed(2)}ms`;
}

function parseInputUrls() {
  const args = process.argv.slice(2);
  return args.filter(arg => arg.trim().length > 0);
}

async function main() {
  console.log('=== Projeto Proxy Pattern - Sistema de Cache de Documentos ===\n');

  const proxy = new ProxyDocument();
  const defaultUrls = [
    'https://docs.google.com/document/d/1SBO-RMoZl8oaWqKF_QL9lBJaOfYT0k3Q/edit?usp=sharing&ouid=110381751451517620878&rtpof=true&sd=true',
    'https://docs.google.com/document/d/19FhVJEn5Z_HCfy2NRwp7ibO5wtqmmW79/edit?usp=sharing&ouid=110381751451517620878&rtpof=true&sd=true'
  ];
  const inputUrls = parseInputUrls();
  const urlsToTest = inputUrls.length > 0 ? inputUrls : defaultUrls;

  if (inputUrls.length > 0) {
    console.log(`Executando com ${inputUrls.length} URL(s) enviada(s) por parametro.\n`);
  } else {
    console.log('Executando com URLs padrao do projeto.\n');
  }

  const requestDurations = [];
  let requestNumber = 1;

  for (let index = 0; index < urlsToTest.length; index += 1) {
    const url = urlsToTest[index];
    const docLabel = `Doc ${index + 1}`;

    console.log(`├─ Requisição ${requestNumber}: ${docLabel}`);
    console.log('└─ Esperado: Cache MISS (servidor acionado)');
    const startMiss = performance.now();
    const missResult = await proxy.download(url);
    const missDuration = performance.now() - startMiss;
    requestDurations.push({ type: 'server', duration: missDuration });
    console.log(`   Resultado: ${missResult}`);
    console.log(`   Tempo: ${formatMs(missDuration)}\n`);
    requestNumber += 1;

    console.log(`├─ Requisição ${requestNumber}: ${docLabel} (repetida)`);
    console.log('└─ Esperado: Cache HIT (retorna imediatamente)');
    const startHit = performance.now();
    const hitResult = await proxy.download(url);
    const hitDuration = performance.now() - startHit;
    requestDurations.push({ type: 'cache', duration: hitDuration });
    console.log(`   Resultado: ${hitResult}`);
    console.log(`   Tempo: ${formatMs(hitDuration)}\n`);
    requestNumber += 1;
  }

  const serverDurations = requestDurations.filter(item => item.type === 'server').map(item => item.duration);
  const cacheDurations = requestDurations.filter(item => item.type === 'cache').map(item => item.duration);
  const totalServer = serverDurations.reduce((acc, value) => acc + value, 0);
  const totalCache = cacheDurations.reduce((acc, value) => acc + value, 0);

  // Resumo: economia de tempo com cache
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('RESUMO - Benefício do Proxy Pattern com Cache:');
  console.log('═══════════════════════════════════════════════════════════════');
  for (let index = 0; index < serverDurations.length; index += 1) {
    const server = serverDurations[index];
    const cache = cacheDurations[index] ?? 0;
    const faster = server > 0 ? ((1 - cache / server) * 100).toFixed(1) : '0.0';
    console.log(`Doc ${index + 1} (Servidor): ${formatMs(server)}`);
    console.log(`Doc ${index + 1} (Cache):    ${formatMs(cache)}  ← ${faster}% mais rapido!`);
  }
  console.log(`\n✓ Total economizado: ${formatMs(totalServer - totalCache)} (aproximadamente)`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('Erro na execução:', err.message);
  process.exit(1);
});
