import { ingestApiClient } from './apiClient';

export interface PdfFile {
  id: string;
  filename: string;
  uploaded_at?: string;
  [key: string]: unknown; 
}

export const fileService = {
  async uploadPdf(file: File): Promise<PdfFile> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await ingestApiClient.post<PdfFile>('/add_pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async listPdfs(): Promise<PdfFile[]> {
    const { data } = await ingestApiClient.get('/list_pdfs');
    console.log('list_pdfs response:', data);
    if (data && typeof data === 'object') {
      const wrapped = data as Record<string, unknown>;
      if (Array.isArray(wrapped.pdfs)) return wrapped.pdfs as PdfFile[];
      if (Array.isArray(wrapped.files)) return wrapped.files as PdfFile[];
    }
    return [];
  },
};