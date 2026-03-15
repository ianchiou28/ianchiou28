import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

desktop_orig = '<button id="theme-toggle" class="theme-toggle-btn">DARK MODE</button>'
desktop_new = '<a href="javascript:openGuestbook()" class="nav-coin text-sm text-neon-yellow hover:text-white transition-colors animate-pulse">留言板</a>\n                <button id="theme-toggle" class="theme-toggle-btn">DARK MODE</button>'
html = html.replace(desktop_orig, desktop_new)


mobile_orig = '<a href="#arcade" class="block py-2 text-gray-text hover:text-neon-pink">游戏厅</a>'
mobile_new = '<a href="#arcade" class="block py-2 text-gray-text hover:text-neon-pink">游戏厅</a>\n            <a href="javascript:openGuestbook()" class="block py-2 text-neon-yellow hover:text-white animate-pulse">留言板</a>'
html = html.replace(mobile_orig, mobile_new)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Nav updated")
