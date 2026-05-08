"""PDF / DOCX / TXT text extraction for evidence files."""

from pathlib import Path

import fitz  # PyMuPDF
from docx import Document as DocxDocument


SUPPORTED_EXTRACTION = {".pdf", ".docx", ".txt"}


def extract_text(file_path: Path) -> str:
    """Best-effort text extraction. Returns empty string for unsupported types."""
    suffix = file_path.suffix.lower()
    try:
        if suffix == ".pdf":
            return _extract_pdf(file_path)
        elif suffix == ".docx":
            return _extract_docx(file_path)
        elif suffix == ".txt":
            return file_path.read_text(encoding="utf-8", errors="ignore")
        else:
            return ""
    except Exception as e:
        return f"[extraction failed: {e}]"


def _extract_pdf(file_path: Path) -> str:
    doc = fitz.open(str(file_path))
    pages: list[str] = []
    for page_num, page in enumerate(doc, 1):
        text = page.get_text("text")
        if text.strip():
            pages.append(f"--- Page {page_num} ---\n{text}")
    doc.close()
    return "\n\n".join(pages)


def _extract_docx(file_path: Path) -> str:
    doc = DocxDocument(str(file_path))
    paragraphs: list[str] = []
    for para in doc.paragraphs:
        if para.text.strip():
            prefix = ""
            if para.style and para.style.name:
                style = para.style.name.lower()
                if "heading" in style:
                    prefix = f"[{para.style.name}] "
            paragraphs.append(f"{prefix}{para.text}")
    return "\n\n".join(paragraphs)
