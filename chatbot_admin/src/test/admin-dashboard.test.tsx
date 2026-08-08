import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/admin-dashboard';
import { fileService } from '../services/fileService';

vi.mock('../services/fileService', () => ({
  fileService: {
    listPdfs: vi.fn(),
    uploadPdf: vi.fn(),
  },
}));

vi.mock('../components/layout/AdminTopBar', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="admin-topbar">{children}</div>
  ),
}));

vi.mock('../components/ui/Card', () => ({
  default: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div>{children}</div>,
}));

vi.mock('../utils/formatDate', () => ({
  formatDate: vi.fn((date?: string) => date ? '01/01/2026' : 'Sin fecha'),
}));

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el panel principal y carga los documentos', async () => {
    const mockFiles = [
      {
        id: '1',
        filename: 'documento1.pdf',
        uploaded_at: '2026-01-01',
      },
      {
        id: '2',
        filename: 'documento2.pdf',
        uploaded_at: '2026-01-02',
      },
    ];

    vi.mocked(fileService.listPdfs).mockResolvedValueOnce(mockFiles);

    render(<AdminDashboard />);

    expect(
      screen.getByText('Plataforma de Administración del Conocimiento NOVA — Panel Principal')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(fileService.listPdfs).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('documento1.pdf')).toBeInTheDocument();
    expect(screen.getByText('documento2.pdf')).toBeInTheDocument();
  });

  it('muestra la cantidad total de fuentes de datos', async () => {
    const mockFiles = [
      {
        id: '1',
        filename: 'documento.pdf',
        uploaded_at: '2026-01-01',
      },
      {
        id: '2',
        filename: 'manual.pdf',
        uploaded_at: '2026-01-02',
      },
    ];

    vi.mocked(fileService.listPdfs).mockResolvedValueOnce(mockFiles);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Fuentes de Datos Totales')).toBeInTheDocument();
    });

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('muestra el mensaje cuando no hay documentos', async () => {
    vi.mocked(fileService.listPdfs).mockResolvedValueOnce([]);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(
        screen.getByText('Todavía no hay documentos cargados.')
      ).toBeInTheDocument();
    });
  });

  it('muestra el estado de carga mientras obtiene los documentos', () => {
    vi.mocked(fileService.listPdfs).mockReturnValueOnce(
      new Promise(() => {})
    );

    render(<AdminDashboard />);

    expect(
      screen.getByText('Cargando documentos...')
    ).toBeInTheDocument();
  });

  it('muestra un error cuando no se pueden cargar los documentos', async () => {
    vi.mocked(fileService.listPdfs).mockRejectedValueOnce(
      new Error('Error de conexión')
    );

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(
        screen.getByText('No se pudo conectar con el servidor.')
      ).toBeInTheDocument();
    });
  });

  it('permite seleccionar un archivo PDF para subirlo', async () => {
    vi.mocked(fileService.listPdfs).mockResolvedValue([]);

    vi.mocked(fileService.uploadPdf).mockResolvedValueOnce({
      id: '3',
      filename: 'nuevo.pdf',
    });

    render(<AdminDashboard />);

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const file = new File(
      ['contenido del pdf'],
      'nuevo.pdf',
      { type: 'application/pdf' }
    );

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(fileService.uploadPdf).toHaveBeenCalledWith(file);
    });
  });

  it('muestra el error del servidor cuando falla la subida', async () => {
    vi.mocked(fileService.listPdfs).mockResolvedValue([]);

    vi.mocked(fileService.uploadPdf).mockRejectedValueOnce({
      response: {
        data: {
          error: 'El archivo no es válido',
        },
        status: 400,
      },
    });

    render(<AdminDashboard />);

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const file = new File(
      ['contenido'],
      'archivo.pdf',
      { type: 'application/pdf' }
    );

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(
        screen.getByText('El archivo no es válido')
      ).toBeInTheDocument();
    });
  });

  it('muestra el estado del bot como en línea y sincronizado', async () => {
    vi.mocked(fileService.listPdfs).mockResolvedValueOnce([]);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(
        screen.getByText('En línea / Sincronizado')
      ).toBeInTheDocument();
    });
  });
});