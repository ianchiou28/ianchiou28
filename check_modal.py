import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
match = re.search(r'(<div[^>]*id="score-modal"[^>]*>[\s\S]*?</div>\s*</div>)', html)
if match:
    print(match.group(1))
