import { useEffect, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { UploadCloud, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminTopBar from '../components/layout/AdminTopBar';
import Card from '../components/ui/Card';
import chatbotLogo from '../assets/images/chabotLogo1.png';
import { fileService } from '../services/fileService';
import type { PdfFile } from '../services/fileService';
import { formatDate } from '../utils/formatDate';
import '../styles/admin-dashboard.css';

export default function AdminDashboard() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadFiles() {
    setIsLoading(true);
    setError('');
    try {
      const list = await fileService.listPdfs();
      setFiles(list);
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string }; status?: number } };
        setError(axiosErr.response?.data?.error ?? `No se pudo cargar la lista (${axiosErr.response?.status}).`);
      } else {
        setError('No se pudo conectar con el servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError('');
      try {
        const list = await fileService.listPdfs();
        if (!cancelled) setFiles(list);
      } catch (err) {
        if (cancelled) return;
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosErr = err as { response?: { data?: { error?: string }; status?: number } };
          setError(axiosErr.response?.data?.error ?? `No se pudo cargar la lista (${axiosErr.response?.status}).`);
        } else {
          setError('No se pudo conectar con el servidor.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpload(file: File) {
    setIsUploading(true);
    setError('');
    try {
      await fileService.uploadPdf(file);
      await loadFiles();
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string }; status?: number } };
        setError(axiosErr.response?.data?.error ?? `No se pudo subir el archivo (${axiosErr.response?.status}).`);
      } else {
        setError('No se pudo conectar con el servidor.');
      }
    } finally {
      setIsUploading(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files;
    if (dropped.length) handleUpload(dropped[0]);
  }

  const lastUpdate = formatDate(files[0]?.uploaded_at as string | undefined);

  return (
    <AdminTopBar>
      <Card className="ad-header-card">
        <img src={chatbotLogo} alt="" width={36} height={36} />
        <h1 className="ad-header-title">
          Plataforma de Administración del Conocimiento NOVA — Panel Principal
        </h1>
      </Card>

      <div className="ad-stats">
        <Card className="ad-stat-card">
          <div>
            <p className="ad-stat-label">Fuentes de Datos Totales</p>
            <p className="ad-stat-value">{files.length}</p>
          </div>
          <FileText size={20} className="ad-stat-icon" />
        </Card>
        <Card className="ad-stat-card">
          <div>
            <p className="ad-stat-label">Última Actualización</p>
            <p className="ad-stat-value">{lastUpdate}</p>
          </div>
          <Clock size={20} className="ad-stat-icon" />
        </Card>
        <Card className="ad-stat-card">
          <div>
            <p className="ad-stat-label">Estado del Bot</p>
            <p className="ad-stat-value ad-stat-value--online">
              <span className="ad-stat-dot" /> En línea / Sincronizado
            </p>
          </div>
          <CheckCircle2 size={20} className="ad-stat-icon" />
        </Card>
      </div>

      <Card className="ad-upload-card">
        <div className="ad-upload-row">
          <div
            className={`ad-dropzone ${isDragging ? 'ad-dropzone--active' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="ad-dropzone__icons">
              <UploadCloud size={26} />
              <FileText size={26} />
            </div>
            <p className="ad-dropzone__text">
              {isUploading
                ? 'Subiendo archivo...'
                : 'Arrastre su PDF aquí para actualizar el conocimiento del chatbot, o haga clic para explorar.'}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) handleUpload(e.target.files[0]);
              }}
            />
          </div>
        </div>
        {error && (
          <div className="ad-error-banner">
            <AlertCircle size={16} className="ad-error-banner__icon" />
            <span>{error}</span>
          </div>
        )}
      </Card>

      <Card className="ad-table-card">
        <h2 className="ad-table-title">Fuentes de Información Activas</h2>
        {isLoading ? (
          <p className="ad-empty">Cargando documentos...</p>
        ) : files.length === 0 ? (
          <p className="ad-empty">Todavía no hay documentos cargados.</p>
        ) : (
          <table className="ad-table">
            <thead>
              <tr>
                <th>Nombre del archivo</th>
                <th>Fecha de carga</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, idx) => (
                <tr key={(file.id as string) ?? idx}>
                  <td>
                    <FileText size={15} className="ad-file-icon" />
                    {file.filename ?? 'Documento sin nombre'}
                  </td>
                  <td>{formatDate(file.uploaded_at as string | undefined)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </AdminTopBar>
  );
}