import { DocumentInterface } from '../interfaces/DocumentInterface.js';
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * RealDocument
 * Implementação real do acesso a documentos.
 * Realiza o download de um documento publico do Google Docs/Drive.
 */
export class RealDocument extends DocumentInterface {
    /**
     * Baixa de forma real um documento publico do Google Docs/Drive.
     * @param {string} source - URL publica do Google Docs/Drive ou fileId
     * @returns {Promise<string>} - Caminho do arquivo salvo localmente
     */
    async download(source) {
        console.log(`  [RealDocument] Iniciando download real de '${source}'...`);

        // Caso seja um fileId ou URL do Google Docs/Drive, lidamos com a exportação
        const fileId = this._extractFileId(source);
        if (fileId) {
            const exportUrl = this._buildExportUrl(source, fileId);
            const response = await fetch(exportUrl, { redirect: 'follow' });

            if (!response.ok) {
                throw new Error(`Falha no download: HTTP ${response.status} ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type') ?? '';
            if (contentType.includes('text/html')) {
                throw new Error(
                    'O Google retornou HTML em vez de arquivo. Verifique se o documento esta publico para "qualquer pessoa com o link".'
                );
            }

            const buffer = Buffer.from(await response.arrayBuffer());
            const outputDir = this._downloadsDir();
            await mkdir(outputDir, { recursive: true });

            const disposition = response.headers.get('content-disposition') ?? '';
            const parsedName = this._filenameFromDisposition(disposition);
            const fallbackName = `google-doc-${fileId}.docx`;
            const outputName = parsedName || fallbackName;
            const outputPath = await this._uniqueOutputPath(outputDir, outputName);

            await writeFile(outputPath, buffer);
            console.log(`  [RealDocument] Download concluido: ${outputPath}`);

            return outputPath;
        }

        // Se for uma URL HTTP/HTTPS genérica (não apenas Google), tentamos download direto
        try {
            const maybeUrl = new URL(source);
            if (maybeUrl.protocol === 'http:' || maybeUrl.protocol === 'https:') {
                const response = await fetch(source, { redirect: 'follow' });
                if (!response.ok) {
                    throw new Error(`Falha no download: HTTP ${response.status} ${response.statusText}`);
                }

                const contentType = response.headers.get('content-type') ?? '';
                // Se retornou HTML, provavelmente não é um arquivo direto
                if (contentType.includes('text/html')) {
                    throw new Error('O servidor retornou HTML em vez de um arquivo binario. Verifique a URL.');
                }

                const buffer = Buffer.from(await response.arrayBuffer());
                const outputDir = this._downloadsDir();
                await mkdir(outputDir, { recursive: true });

                // Determina nome: content-disposition > caminho da URL > fallback
                const disposition = response.headers.get('content-disposition') ?? '';
                let parsedName = this._filenameFromDisposition(disposition);
                if (!parsedName) {
                    // Tenta extrair do caminho da URL
                    const pathname = maybeUrl.pathname || '';
                    const base = path.basename(pathname) || '';
                    parsedName = base || null;
                }

                // Inferir extensão se ausente a partir do content-type (simples)
                let outputName = parsedName || null;
                if (outputName) {
                    if (!path.extname(outputName)) {
                        outputName += this._extensionFromContentType(contentType);
                    }
                } else {
                    outputName = `downloaded-file${this._extensionFromContentType(contentType)}`;
                }

                const outputPath = await this._uniqueOutputPath(outputDir, outputName);
                await writeFile(outputPath, buffer);
                console.log(`  [RealDocument] Download concluido: ${outputPath}`);
                return outputPath;
            }
        } catch (err) {
            // não é uma URL válida — cai no erro abaixo
        }

        throw new Error('Nao foi possivel processar a origem informada. Use URL http(s) ou um fileId do Google.');
    }

    _extractFileId(source) {
        if (!source) return null;

        if (/^[a-zA-Z0-9_-]{20,}$/.test(source)) {
            return source;
        }

        const patterns = [
            /\/document\/d\/([a-zA-Z0-9_-]+)/,
            /\/file\/d\/([a-zA-Z0-9_-]+)/,
            /[?&]id=([a-zA-Z0-9_-]+)/
        ];

        for (const pattern of patterns) {
            const match = source.match(pattern);
            if (match?.[1]) return match[1];
        }

        return null;
    }

    _buildExportUrl(source, fileId) {
        if (source.includes('docs.google.com/document/')) {
            return `https://docs.google.com/document/d/${fileId}/export?format=docx`;
        }

        return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    _downloadsDir() {
        const currentFile = fileURLToPath(import.meta.url);
        const currentDir = path.dirname(currentFile);
        return path.resolve(currentDir, '../../downloads');
    }

    _filenameFromDisposition(disposition) {
        const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
        if (utf8Match?.[1]) {
            return decodeURIComponent(utf8Match[1]);
        }

        const asciiMatch = disposition.match(/filename="?([^";]+)"?/i);
        if (asciiMatch?.[1]) {
            return asciiMatch[1];
        }

        return null;
    }

    _extensionFromContentType(contentType) {
        if (!contentType) return '.bin';
        const ct = contentType.split(';')[0].trim().toLowerCase();
        if (ct === 'application/pdf') return '.pdf';
        if (ct === 'text/plain') return '.txt';
        if (ct === 'application/zip') return '.zip';
        if (ct === 'application/msword') return '.doc';
        if (ct === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return '.docx';
        if (ct.startsWith('image/')) return `.${ct.split('/')[1]}`;
        if (ct === 'application/octet-stream') return '.bin';
        return '.bin';
    }
    async _uniqueOutputPath(outputDir, filename) {
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
