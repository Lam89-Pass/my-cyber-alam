// ─── Enums ─────────────────────────────────────────────────────────────────────
export enum ScanStatus {
  AMAN = "AMAN",
  BERBAHAYA = "BERBAHAYA",
  MENCURIGAKAN = "MENCURIGAKAN",
}

export enum ScanType {
  URL    = "url",
  FILE   = "file",
  PHONE  = "phone",
  EMAIL  = "email",
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
  // Phone specific
  operator?: string;
  region?: string;
  reportedCount?: string;
  scamType?: string;
  // Email specific
  emailDomain?: string;
  spfStatus?: string;
  dmarcStatus?: string;
  breachFound?: string;
  senderReputation?: string;
}

export interface IScanService {
  scanUrl(url: string): Promise<IScanResult>;
  scanFile(fileName: string, fileSize: number): Promise<IScanResult>;
  scanPhone(phone: string): Promise<IScanResult>;
  scanEmail(email: string): Promise<IScanResult>;
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