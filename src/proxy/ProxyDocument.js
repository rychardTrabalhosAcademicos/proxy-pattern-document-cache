import { DocumentInterface } from '../interfaces/DocumentInterface.js';
import { RealDocument } from '../real/RealDocument.js';
import { CacheManager } from '../cache/CacheManager.js';
import { copyFile, access } from 'node:fs/promises';
import path from 'node:path';

/**
 * ProxyDocument
 * Proxy que intercepta requisições de download e controla o acesso ao RealDocument.
 * Implementa a lógica de cache: verifica o cache antes de delegar ao RealDocument.
 */
export class ProxyDocument extends DocumentInterface {
    constructor() {
        super();
        /** @type {RealDocument} */
        this._realDocument = new RealDocument();
        /** @type {CacheManager} */
        this._cache = new CacheManager();
    }

    /**
     * Intercepta a requisição de download.
     * Lógica:
     * 1. Verifica se o documento está em cache.
     * 2. Se SIM (Cache HIT) → retorna do cache imediatamente.
     * 3. Se NÃO (Cache MISS) → delega ao RealDocument, armazena em cache e retorna.
     * @param {string} filename - Nome do arquivo a ser baixado
     * @returns {Promise<string>} - Conteúdo do documento com indicação de origem
     */
    async download(filename) {
        console.log(`\n[ProxyDocument] Requisição de download: '${filename}'`);
        
        // Verifica se o documento está em cache
        if (this._cache.has(filename)) {
            // Cache HIT - document já foi carregado anteriormente
            const cachedPath = this._cache.get(filename);
            console.log(`[ProxyDocument] ✓ Encontrado em cache: ${cachedPath}`);

            // Em vez de retornar o mesmo arquivo (que poderia sobrescrever em execuções subsequentes),
            // criamos uma cópia única do arquivo em downloads e retornamos o novo caminho.
            const outputDir = path.dirname(cachedPath);
            const originalName = path.basename(cachedPath);
            const copyPath = await this._uniqueCopyPath(outputDir, originalName);
            await copyFile(cachedPath, copyPath);
            console.log(`[ProxyDocument] Cópia de cache criada: ${copyPath}`);
            return `${copyPath} [Cache]`;
        }
        
        // Cache MISS - document precisa ser carregado do servidor
        console.log(`[ProxyDocument] ✗ Não encontrado em cache. Delegando ao RealDocument...`);
        const content = await this._realDocument.download(filename);
        
        // Armazena o documento no cache para futuras requisições
        this._cache.set(filename, content);
        console.log(`[ProxyDocument] Documento armazenado em cache`);
        
        return `${content} [Servidor]`;
    }

    async _uniqueCopyPath(outputDir, filename) {
        const ext = path.extname(filename);
        const base = path.basename(filename, ext);

        let counter = 0;
        while (true) {
            const suffix = counter === 0 ? '' : ` (${counter})`;
            const candidate = path.join(outputDir, `${base}${suffix}${ext}`);
            try {
                await access(candidate);
                counter += 1;
            } catch {
                return candidate;
            }
        }
    }
}
