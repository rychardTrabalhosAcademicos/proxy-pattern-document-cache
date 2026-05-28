import { DocumentInterface } from '../interfaces/DocumentInterface.js';
import { RealDocument } from '../real/RealDocument.js';
import { CacheManager } from '../cache/CacheManager.js';
import { copyFile, access } from 'node:fs/promises';
import path from 'node:path';

export class ProxyDocument extends DocumentInterface {
    constructor(realDocument = new RealDocument(), cache = new CacheManager()) {
        super();
        this._realDocument = realDocument;
        this._cache = cache;
    }

    async download(filename) {
        console.log(`\n[ProxyDocument] Requisição de download: '${filename}'`);

        if (this._cache.has(filename)) {
            const cachedPath = this._cache.get(filename);
            console.log(`[ProxyDocument] ✓ Encontrado em cache: ${cachedPath}`);

            const outputDir = path.dirname(cachedPath);
            const originalName = path.basename(cachedPath);
            const copyPath = await this._uniqueCopyPath(outputDir, originalName);
            await copyFile(cachedPath, copyPath);

            console.log(`[ProxyDocument] Cópia de cache criada: ${copyPath}`);
            return `${copyPath} [Cache]`;
        }

        console.log(`[ProxyDocument] ✗ Não encontrado em cache. Delegando ao RealDocument...`);
        const content = await this._realDocument.download(filename);

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