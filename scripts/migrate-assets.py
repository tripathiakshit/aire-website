#!/usr/bin/env python3
"""
Copy only the images actually referenced in page content (+ logo) to /public/assets/.
Also prints a mapping of old URL → new local path.
"""

import os
import re
import json
import shutil

UPLOADS_DIR  = '/tmp/wpress-extract/uploads'
PUBLIC_DIR   = '/home/atripathi/Documents/repos/geoexploration-website-2/public/assets'
PARSED_JSON  = '/tmp/wpress-extract/parsed-content.json'

os.makedirs(PUBLIC_DIR, exist_ok=True)

with open(PARSED_JSON) as f:
    data = json.load(f)

image_urls = data['image_urls']

# Build a flat index of filename → full path in uploads dir
print("Indexing uploads directory...")
file_index = {}  # basename (lower) → full path
for root, dirs, files in os.walk(UPLOADS_DIR):
    # skip resized thumbnails (e.g. image-300x200.jpg)
    for fname in files:
        # Skip thumbnail variants
        if re.search(r'-\d+x\d+\.\w+$', fname):
            continue
        lower = fname.lower()
        full  = os.path.join(root, fname)
        # Prefer the full-size (non-scaled) version if duplicates exist
        if lower not in file_index or 'scaled' not in fname:
            file_index[lower] = full
print(f"  Indexed {len(file_index)} original-size images\n")

# Also add scaled versions as fallback
scaled_index = {}
for root, dirs, files in os.walk(UPLOADS_DIR):
    for fname in files:
        if re.search(r'-\d+x\d+\.\w+$', fname):
            continue
        lower = fname.lower()
        full  = os.path.join(root, fname)
        if lower not in scaled_index:
            scaled_index[lower] = full

# Always include the logo
logo_files = ['AIRE-logo-long.jpg', 'cropped-AIRE-logo-long.jpg', 'amit_tripathi.jpg']
for lf in logo_files:
    path = os.path.join(UPLOADS_DIR, '2025', '05', lf)
    if os.path.exists(path):
        dst = os.path.join(PUBLIC_DIR, lf)
        shutil.copy2(path, dst)
        print(f"  [logo] {lf} → /assets/{lf}")

print()

# Copy each referenced image
url_to_local = {}
missing = []

for url in image_urls:
    fname = url.rstrip('/').split('/')[-1]
    lower = fname.lower()

    src = file_index.get(lower) or scaled_index.get(lower)
    if not src:
        # Try without scaled suffix in name
        base = re.sub(r'-scaled(\.\w+)$', r'\1', lower)
        src  = file_index.get(base) or scaled_index.get(base)

    if src:
        # Use original filename (preserve case)
        out_fname = os.path.basename(src)
        dst       = os.path.join(PUBLIC_DIR, out_fname)
        shutil.copy2(src, dst)
        local_path = f"/assets/{out_fname}"
        url_to_local[url] = local_path
        print(f"  [ok] {fname} → {local_path}")
    else:
        missing.append(url)
        url_to_local[url] = f"/assets/{fname}"  # placeholder
        print(f"  [!!] NOT FOUND: {fname}")

print(f"\nCopied {len(url_to_local) - len(missing)}/{len(image_urls)} images")
if missing:
    print(f"Missing {len(missing)} images:")
    for u in missing:
        print(f"  {u}")

# Save the URL mapping for use during page generation
mapping_path = '/tmp/wpress-extract/url-mapping.json'
with open(mapping_path, 'w') as f:
    json.dump(url_to_local, f, indent=2)
print(f"\nURL mapping saved to {mapping_path}")
