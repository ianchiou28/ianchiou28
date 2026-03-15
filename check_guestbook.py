import re
with open("index.html", "r", encoding="utf-8") as f:
    text = f.read()

match = re.search(r"<section id=\"guestbook\"[\s\S]*?</section>", text)
if match:
    print(match.group(0))
