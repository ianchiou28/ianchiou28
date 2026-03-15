import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Change 'ALL' filter to 'GUEST'
text = text.replace(
    '<button class="score-filter-btn is-active" data-game="ALL">ALL</button>',
    '<button class="score-filter-btn is-active" data-game="GUEST">留言板 (GUEST)</button>'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Change default filter to 'GUEST'
js = js.replace("let currentScoreFilter = 'ALL';", "let currentScoreFilter = 'GUEST';")

# We previously had `currentScoreFilter === 'ALL' ? highScores : highScores.filter(...)`
# Since we no longer have an ALL button, it will strictly just filter by the exact game selected, 
# which is perfect (GUEST will filter to 'GUEST', SNAKE to 'SNAKE'). But we can leave the 'ALL' check in JS just in case, it will just never be triggered.
# In fact, let's remove the ALL check to strictly enforce it.

js = re.sub(
    r'const filteredScores = currentScoreFilter === \'ALL\'\s*\?\s*highScores\s*:\s*highScores\.filter\(record => record\.game === currentScoreFilter\);',
    r'const filteredScores = highScores.filter(record => record.game === currentScoreFilter);',
    js
)

# And one logic issue, right now we sort by date when clicking ALL/GUEST. But for SNAKE/TETRIS/PACMAN, it should sort by score.
# Currently, all logic has: `b.score - a.score` but earlier we replaced it with sorting by Date everywhere, or maybe only for Guestbook. Let's check how saving sorts.
# Before:
# `highScores = highScores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())`
# But game scores should be sorted by score. The easiest way to handle this on display time is:
render_logic = '''
    const filteredScores = highScores.filter(record => record.game === currentScoreFilter);

    // If it's a game, sort by score descending. If it's GUEST, keep date descending.
    if (currentScoreFilter !== 'GUEST') {
        filteredScores.sort((a, b) => b.score - a.score);
    } else {
        filteredScores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
'''

js = js.replace('const filteredScores = highScores.filter(record => record.game === currentScoreFilter);', render_logic)
js = js.replace("const filteredScores = currentScoreFilter === 'ALL'\n        ? highScores\n        : highScores.filter(record => record.game === currentScoreFilter);", render_logic)

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print('Updated Filter successfully')
