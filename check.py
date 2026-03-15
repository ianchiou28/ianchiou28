with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
print("Matches found:", len(re.findall(r'WILD MESSAGES', text)))
