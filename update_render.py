with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re

old_render = r'''return `
                <div class="score-row">
                    <div class="score-rank \$\{rankColor\(rank\)\}">(?:#\$\{rank\})?</div>\s*
                    <div>
                        <div class="font-pixel text-xs text-cool-white">\$\{record\.game\}</div>
                        <div class="score-meta">DATE \$\{record\.date\}</div>\s*
                    </div>
                    <div class="score-value">\$\{record\.score\}</div>
                </div>
            `;'''

new_render = '''return `
                <div class="score-row">
                    <div class="score-rank ${rankColor(rank)}">#${rank}</div>   
                    <div>
                        <div class="font-pixel text-xs text-cool-white">${record.game}</div>
                        <div class="score-meta">DATE ${record.date}</div>       
                    </div>
                    <div class="flex flex-col gap-1 overflow-hidden">
                        <div class="font-mono text-xs text-neon-blue truncate">${record.name || 'ANON'}</div>
                        <div class="font-mono text-[10px] text-gray-text truncate">${record.message || '-'}</div>
                    </div>
                    <div class="score-value">${record.score === '-' ? '<span class="text-xs text-gray-500">留言</span>' : record.score}</div>
                </div>
            `;'''

import re
js = re.sub(
    r'return `\s*<div class="score-row">[\s\S]*?</div>\s*`;',
    new_render,
    js
)

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Fixed renderHighScores")
