// ─── Enums ─────────────────────────────────────────────────────────────────────
export enum ScanStatus {
  AMAN = "AMAN",
  BERBAHAYA = "BERBAHAYA",
  MENCURIGAKAN = "MENCURIGAKAN",
}

export enum ScanType {
  URL = "url",
  FILE = "file",
}

// ─── Interfaces ────────────────────────────────────────────────────────────────
export interface IScanResult {
  status: ScanStatus;
  riskScore: number;
  category: string;
  summary: string;
  indicators: string[];
  recommendation: string;
  type: ScanType;
  inputRef: string;
  scannedAt: Date;
  // URL specific
  domain?: string;
  ssl?: string;
  redirects?: string;
  ipReputation?: string;
  // File specific
  fileType?: string;
  dangerousPermissions?: string[];
}

export interface IScanService {
  scanUrl(url: string): Promise<IScanResult>;
  scanFile(fileName: string, fileSize: number): Promise<IScanResult>;
}

export interface INavbarProps {
  onTentangClick: () => void;
}

export interface IModalProps {
  onClose: () => void;
}

export interface IResultCardProps {
  result: IScanResult;
}

export interface IScannerProps {
  onResult: (result: IScanResult) => void;
  onError: (msg: string) => void;
  isScanning: boolean;
  setIsScanning: (v: boolean) => void;
}