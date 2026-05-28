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

describe('ProxyDocument', () => {
    let tempDir;

    beforeEach(async () => {
        tempDir = await mkdir(path.join(os.tmpdir(), `proxy-test-${Date.now()}-${Math.random()}`), { recursive: true });
    });

    afterEach(async () => {
        if (tempDir) {
            await rm(tempDir, { recursive: true, force: true });
        }
    });

    test('Primeira requisicao deve vir do servidor', async () => {
        const fakeReal = new FakeRealDocument(tempDir);
        const proxy = new ProxyDocument(fakeReal, new CacheManager());

        const resultado = await proxy.download('doc1');

        expect(resultado).toContain('[Servidor]');
    });

    test('Segunda requisicao deve vir do cache', async () => {
        const fakeReal = new FakeRealDocument(tempDir);
        const proxy = new ProxyDocument(fakeReal, new CacheManager());

        await proxy.download('doc1');
        const resultado = await proxy.download('doc1');

        expect(resultado).toContain('[Cache]');
    });

    test('Nao deve baixar novamente arquivo em cache', async () => {
        let contadorDownloads = 0;

        class CountingFakeRealDocument {
            constructor(baseDir) {
                this.baseDir = baseDir;
            }

            async download(source) {
                contadorDownloads++;
                const filePath = path.join(this.baseDir, `${source}.pdf`);
                await writeFile(filePath, `conteudo fake de ${source}`);
                return filePath;
            }
        }

        const fakeReal = new CountingFakeRealDocument(tempDir);
        const proxy = new ProxyDocument(fakeReal, new CacheManager());

        await proxy.download('doc1');
        await proxy.download('doc1');

        expect(contadorDownloads).toBe(1);
    });
});