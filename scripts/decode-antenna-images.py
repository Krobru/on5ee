#!/usr/bin/env python3
"""Decode images-b64/*.webp.b64 into images/*.webp. Stdlib only."""
import base64
import sys
from pathlib import Path

src = Path("images-b64")
dest = Path("images")
dest.mkdir(parents=True, exist_ok=True)
written = 0
for p in sorted(src.glob("*.webp.b64")):
    out = dest / p.name[:-4]  # strip .b64
    data = base64.b64decode(p.read_text())
    if data[:4] != b"RIFF" and data[:4] != b"RIFF"[0:4]:
        # WebP starts with RIFF
        if not data.startswith(b"RIFF"):
            print(f"unexpected header for {p.name}: {data[:8]!r}", file=sys.stderr)
            sys.exit(1)
    out.write_bytes(data)
    print(f"wrote {out} ({len(data)} bytes)")
    written += 1
if written != 4:
    print(f"expected 4 images, got {written}", file=sys.stderr)
    sys.exit(1)
