import re

with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace("button.dataset.game || 'ALL'", "button.dataset.game || 'GUEST'")

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Done")