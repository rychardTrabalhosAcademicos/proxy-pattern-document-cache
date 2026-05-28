import { CacheManager } from '../src/cache/CacheManager.js';

describe('CacheManager', () => {

    test('Deve armazenar arquivo no cache', () => {

        const cache = new CacheManager();

        cache.set('doc1', '/downloads/doc1.pdf');

        expect(cache.has('doc1')).toBe(true);

        expect(
            cache.get('doc1')
        ).toBe('/downloads/doc1.pdf');

    });

    test('Deve retornar false para arquivo inexistente', () => {

        const cache = new CacheManager();

        expect(
            cache.has('arquivo-inexistente')
        ).toBe(false);

    });

    test('Deve retornar null para chave inexistente', () => {

        const cache = new CacheManager();

        expect(
            cache.get('arquivo-inexistente')
        ).toBe(null);

    });

});