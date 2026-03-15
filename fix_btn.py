import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('[ RECORD SCORE ]', '[ ADD RECORD / 提交留言 ]')
html = html.replace('<button id="score-submit-btn"', '<button id="score-cancel-btn" onclick="document.getElementById(\'score-modal\').classList.add(\'hidden\');document.getElementById(\'score-modal\').classList.add(\'opacity-0\');" class="w-full mt-2 py-3 border-2 border-slate-500 hover:bg-slate-800 text-cool-white font-pixel text-xs tracking-widest transition-colors">[ CANCEL / 取消 ]</button>\n                <button id="score-submit-btn"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
