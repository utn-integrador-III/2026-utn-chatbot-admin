import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fileService } from '../services/fileService';
import { ingestApiClient } from '../services/apiClient';

vi.mock('../services/apiClient', () => ({
  ingestApiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('fileService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uploadPdf envía el archivo como FormData a /add_pdf', async () => {
    const mockFile = new File(
      ['contenido'],
      'documento.pdf',
      { type: 'application/pdf' }
    );

    const mockResponse = {
      data: {
        id: '1',
        filename: 'documento.pdf',
      },
    };

    (ingestApiClient.post as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(mockResponse);

    const result = await fileService.uploadPdf(mockFile);

    expect(ingestApiClient.post).toHaveBeenCalledWith(
      '/add_pdf',
      expect.any(FormData),
      expect.objectContaining({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );

    expect(result).toEqual(mockResponse.data);
  });

  it('listPdfs devuelve el array cuando la respuesta viene envuelta en { pdfs: [...] }', async () => {
    const mockFiles = [
      { id: '1', filename: 'a.pdf' },
      { id: '2', filename: 'b.pdf' },
    ];

    (ingestApiClient.get as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        data: {
          pdfs: mockFiles,
          total: 2,
        },
      });

    const result = await fileService.listPdfs();

    expect(result).toEqual(mockFiles);
  });

  it('listPdfs devuelve el array cuando la respuesta viene envuelta en { files: [...] }', async () => {
    const mockFiles = [
      { id: '1', filename: 'a.pdf' },
    ];

    (ingestApiClient.get as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        data: {
          files: mockFiles,
        },
      });

    const result = await fileService.listPdfs();

    expect(result).toEqual(mockFiles);
  });

  it('listPdfs devuelve un array vacío si la respuesta no tiene el formato esperado', async () => {
    (ingestApiClient.get as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        data: {},
      });

    const result = await fileService.listPdfs();

    expect(result).toEqual([]);
  });
});

