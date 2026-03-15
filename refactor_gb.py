import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('NEW HIGH SCORE!', 'GUESTBOOK / 留言墙')
html = html.replace('You destroyed the machine.', 'Leave your mark on the arcade.')
html = html.replace('ENTER NAME (e.g. AAA)', 'YOUR NAME')
html = html.replace('ENTER MESSAGE (keep it cool)', 'ENTER MESSAGE / 留言')
html = html.replace('SUBMIT SCORE', 'SUBMIT / 提交')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Remove the automatic registerHighScore calls in main.js
js = re.sub(r'registerHighScore\([^\)]+\);', '', js)

# Change registerHighScore function to something plain
js = js.replace('function registerHighScore(gameName, score) {', 'function openGuestbook() { let score = "-"; let gameName = "GUEST"; ')
js = js.replace('if (!Number.isFinite(score) || score <= 0) return;', '')
js = js.replace('document.getElementById(\'score-modal-subtitle\').textContent = `${gameName} - SCORE: ${score}`;', '')

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Refactored guestbook")
