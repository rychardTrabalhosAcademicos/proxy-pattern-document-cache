import { ProxyDocument } from '../src/proxy/ProxyDocument.js';
import { CacheManager } from '../src/cache/CacheManager.js';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

class FakeRealDocument {
    constructor(baseDir) {
        this.baseDir = baseDir;
    }

    async download(source) {
        const filePath = path.join(this.baseDir, `${source}.pdf`);
        await writeFile(filePath, `conteudo fake de ${source}`);
        return filePath;
    }
}

describe('Integracao Completa', () => {
    let tempDir;

    beforeEach(async () => {
        tempDir = await mkdir(path.join(os.tmpdir(), `integration-test-${Date.now()}-${Math.random()}`), { recursive: true });
    });

    afterEach(async () => {
        if (tempDir) {
            await rm(tempDir, { recursive: true, force: true });
        }
    });

    test('Fluxo completo deve funcionar', async () => {
        const proxy = new ProxyDocument(new FakeRealDocument(tempDir), new CacheManager());

        const resultado1 = await proxy.download('relatorio');
        const resultado2 = await proxy.download('relatorio');

        expect(resultado1).toContain('[Servidor]');
        expect(resultado2).toContain('[Cache]');
    });

    test('Deve armazenar arquivos diferentes separadamente', async () => {
        const proxy = new ProxyDocument(new FakeRealDocument(tempDir), new CacheManager());

        const doc1 = await proxy.download('arquivo1');
        const doc2 = await proxy.download('arquivo2');

        expect(doc1).not.toEqual(doc2);
    });
});