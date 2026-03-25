#!/usr/bin/env python3
"""
Parse the WordPress SQL dump and extract:
- All published pages and posts (with content)
- Site options (title, description)
- All image filenames referenced in content
"""

import re
import json
import os

SQL_PATH = '/tmp/wpress-extract/database.sql'
OUT_PATH = '/tmp/wpress-extract/parsed-content.json'


def unescape_sql(s):
    return (s
        .replace("\\'", "'")
        .replace('\\"', '"')
        .replace('\\n', '\n')
        .replace('\\r', '\r')
        .replace('\\\\', '\\')
        .replace('\\0', '\x00')
    )


def parse_sql_row_values(row_str):
    """Parse a SQL values tuple string into a list of Python values."""
    fields = []
    i = 0
    n = len(row_str)
    while i < n:
        # Skip whitespace/comma between fields
        while i < n and row_str[i] in (' ', '\t', ','):
            i += 1
        if i >= n:
            break

        if row_str[i] == "'":
            # Quoted string field
            i += 1
            buf = []
            while i < n:
                c = row_str[i]
                if c == '\\' and i + 1 < n:
                    buf.append(row_str[i:i+2])
                    i += 2
                elif c == "'":
                    i += 1
                    break
                else:
                    buf.append(c)
                    i += 1
            fields.append(unescape_sql(''.join(buf)))
        else:
            # Unquoted (NULL, number)
            j = i
            while j < n and row_str[j] not in (',', ')'):
                j += 1
            val = row_str[i:j].strip()
            fields.append(None if val == 'NULL' else val)
            i = j

    return fields


def parse_posts(sql):
    posts = []
    # Each post is its own INSERT line
    pattern = re.compile(
        r"INSERT INTO `SERVMASK_PREFIX_posts` VALUES \((.*?)\);\s*$",
        re.MULTILINE | re.DOTALL
    )

    for m in pattern.finditer(sql):
        fields = parse_sql_row_values(m.group(1))
        if len(fields) < 21:
            continue

        # WordPress posts table column order:
        # 0:ID, 1:post_author, 2:post_date, 3:post_date_gmt, 4:post_content,
        # 5:post_title, 6:post_excerpt, 7:post_status, 8:comment_status,
        # 9:ping_status, 10:post_password, 11:post_name, 12:to_ping,
        # 13:pinged, 14:post_modified, 15:post_modified_gmt,
        # 16:post_content_filtered, 17:post_parent, 18:guid,
        # 19:menu_order, 20:post_type, 21:post_mime_type, 22:comment_count

        post_id      = fields[0]
        post_date    = fields[2]
        post_content = fields[4] or ''
        post_title   = fields[5] or ''
        post_excerpt = fields[6] or ''
        post_status  = fields[7] or ''
        post_name    = fields[11] or ''
        post_type    = fields[20] or ''

        if post_status != 'publish':
            continue
        if post_type not in ('page', 'post'):
            continue
        if not post_title or post_title == 'Auto Draft':
            continue

        posts.append({
            'id': post_id,
            'type': post_type,
            'title': post_title,
            'slug': post_name,
            'date': post_date,
            'excerpt': post_excerpt,
            'content': post_content,
        })

    return posts


def parse_options(sql):
    options = {}
    pattern = re.compile(
        r"INSERT INTO `SERVMASK_PREFIX_options` VALUES \(\d+,'([^'\\]*(?:\\.[^'\\]*)*)','((?:[^'\\]|\\.)*)'"
    )
    keys_of_interest = {'blogname', 'blogdescription', 'siteurl', 'home', 'site_icon', 'site_logo'}
    for m in pattern.finditer(sql):
        key = unescape_sql(m.group(1))
        val = unescape_sql(m.group(2))
        if key in keys_of_interest:
            options[key] = val
    return options


def find_image_filenames(posts):
    """Collect upload filenames referenced in post content."""
    urls = set()
    url_pattern = re.compile(
        r'https?://[^\s"\'<>]*wp-content/uploads/[^\s"\'<>]+\.(?:jpg|jpeg|png|gif|webp|svg|pdf)',
        re.IGNORECASE
    )
    for p in posts:
        for url in url_pattern.findall(p['content']):
            # strip srcset size suffixes like -300x200.jpg → keep original
            clean = re.sub(r'-\d+x\d+(\.\w+)$', r'\1', url.split('?')[0])
            urls.add(clean)
    return sorted(urls)


if __name__ == '__main__':
    print("Reading SQL dump...")
    with open(SQL_PATH, 'r', encoding='utf-8', errors='replace') as f:
        sql = f.read()

    print("Parsing posts/pages...")
    posts = parse_posts(sql)
    print(f"  Found {len(posts)} published pages/posts")
    for p in posts:
        content_preview = p['content'][:80].replace('\n', ' ')
        print(f"  [{p['type']:4}] {p['id']:>4}: {p['title']!r:40} slug={p['slug']!r}")

    print("\nParsing site options...")
    options = parse_options(sql)
    for k, v in options.items():
        print(f"  {k}: {v!r}")

    print("\nCollecting referenced image URLs from content...")
    image_urls = find_image_filenames(posts)
    print(f"  Found {len(image_urls)} unique image URLs")
    for u in image_urls:
        print(f"  {u}")

    out = {'options': options, 'posts': posts, 'image_urls': image_urls}
    with open(OUT_PATH, 'w') as f:
        json.dump(out, f, indent=2)
    print(f"\nFull content saved to {OUT_PATH}")
