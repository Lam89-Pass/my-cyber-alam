import sys
import json
import hashlib
import os
from androguard.core.bytecodes.apk import APK

class APKInspector:
    """
    Class khusus untuk menangani inspeksi file APK.
    Menggunakan prinsip OOP untuk enkapsulasi logika analisis.
    """
    
    # Konstanta untuk permission berbahaya
    DANGEROUS_PERMS = [
        "android.permission.READ_SMS",
        "android.permission.SEND_SMS",
        "android.permission.RECEIVE_SMS",
        "android.permission.READ_CONTACTS",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.GET_ACCOUNTS"
    ]

    def __init__(self, file_path):
        self.file_path = file_path
        self.apk_obj = None
        self.report = {
            "status": "pending",
            "file_name": os.path.basename(file_path),
            "meta": {},
            "security": {},
            "hash": ""
        }

    def load_apk(self):
        """Mencoba memuat APK ke memory"""
        try:
            if not os.path.exists(self.file_path):
                raise FileNotFoundError(f"File not found: {self.file_path}")
            self.apk_obj = APK(self.file_path)
            return True
        except Exception as e:
            self.report["status"] = "error"
            self.report["error"] = str(e)
            return False

    def _extract_metadata(self):
        """Private method: Ambil info dasar"""
        if not self.apk_obj: return
        
        self.report["meta"] = {
            "package_name": self.apk_obj.get_package(),
            "app_name": self.apk_obj.get_app_name(),
            "version_name": self.apk_obj.get_androidversion_name(),
            "version_code": self.apk_obj.get_androidversion_code(),
            "min_sdk": self.apk_obj.get_min_sdk_version()
        }

    def _analyze_security(self):
        """Private method: Analisis permission"""
        if not self.apk_obj: return

        requested_perms = self.apk_obj.get_permissions()
        flagged = [p for p in requested_perms if p in self.DANGEROUS_PERMS]
        
        # Risk Calculation Logic (Sederhana)
        risk_score = len(flagged) * 10 
        risk_score = min(risk_score, 100) # Max 100

        self.report["security"] = {
            "total_permissions": len(requested_perms),
            "dangerous_permissions": flagged,
            "risk_score": risk_score,
            "is_malicious": risk_score > 50
        }

    def _calculate_hash(self):
        """Private method: Hitung SHA256 untuk footprint"""
        sha256 = hashlib.sha256()
        with open(self.file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256.update(byte_block)
        self.report["hash"] = sha256.hexdigest()

    def run_scan(self):
        """Method utama untuk menjalankan semua proses scan"""
        if self.load_apk():
            self._extract_metadata()
            self._analyze_security()
            self._calculate_hash()
            self.report["status"] = "success"
        
        return self.report

# --- Main Execution Block ---
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"status": "error", "message": "No file path provided"}))
        sys.exit(1)

    target_file = sys.argv[1]
    
    # Instansiasi Object
    inspector = APKInspector(target_file)
    
    # Jalankan Method
    result = inspector.run_scan()
    
    # Output JSON
    print(json.dumps(result, indent=2))