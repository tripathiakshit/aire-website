#!/usr/bin/env python3
"""Extract a .wpress archive (All-in-One WP Migration format)."""

import os
import sys
import struct

# .wpress header layout per entry:
#   name   : 255 bytes (null-padded filename)
#   size   : 14  bytes (ASCII file size, null-padded)
#   mtime  : 12  bytes (null-padded)
#   prefix : 4096 bytes (null-padded directory path)
# Total    : 4377 bytes

HEADER_SIZE = 4377
NAME_LEN    = 255
SIZE_LEN    = 14
MTIME_LEN   = 12
PREFIX_LEN  = 4096


def parse_header(raw: bytes):
    name   = raw[:NAME_LEN].rstrip(b'\x00').decode('utf-8', errors='replace')
    size   = int(raw[NAME_LEN:NAME_LEN + SIZE_LEN].rstrip(b'\x00') or b'0')
    prefix = raw[NAME_LEN + SIZE_LEN + MTIME_LEN:].rstrip(b'\x00').decode('utf-8', errors='replace')
    return name, size, prefix


def extract(wpress_path: str, output_dir: str):
    os.makedirs(output_dir, exist_ok=True)
    total_files = 0

    with open(wpress_path, 'rb') as f:
        while True:
            header_raw = f.read(HEADER_SIZE)
            if len(header_raw) < HEADER_SIZE:
                break

            name, size, prefix = parse_header(header_raw)
            if not name:
                f.seek(size, 1)
                continue

            rel_path = os.path.join(prefix, name) if prefix else name
            out_path  = os.path.join(output_dir, rel_path)

            os.makedirs(os.path.dirname(out_path), exist_ok=True)

            with open(out_path, 'wb') as out:
                remaining = size
                while remaining > 0:
                    chunk = f.read(min(65536, remaining))
                    if not chunk:
                        break
                    out.write(chunk)
                    remaining -= len(chunk)

            total_files += 1
            if total_files % 100 == 0:
                print(f"  extracted {total_files} files...", flush=True)

    print(f"Done — {total_files} files extracted to {output_dir}")


if __name__ == '__main__':
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser(
        '~/Downloads/geoexplorationllc-com-20260325-165543-u2mc3oiju7p0.wpress'
    )
    dst = sys.argv[2] if len(sys.argv) > 2 else '/tmp/wpress-extract'
    print(f"Extracting {src} → {dst}")
    extract(src, dst)
