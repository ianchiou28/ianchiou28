import re

with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

new_seeds = '''const seedHighScores = [
    { game: 'PACMAN', score: 1420, name: 'IAN', message: 'Ready Player One!', date: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
    { game: 'GUEST', score: '-', name: 'ALICE', message: '这背景音乐太复古了！爱了爱了', date: new Date(Date.now() - 4*24*60*60*1000).toISOString() },
    { game: 'TETRIS', score: 1200, name: 'TREE', message: 'Nice website, bro.', date: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
    { game: 'GUEST', score: '-', name: 'BOB', message: '贪吃蛇怎么不能穿墙？提个建议', date: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
    { game: 'SNAKE', score: 980, name: 'AAA', message: '', date: '2026-03-08' },
    { game: 'PACMAN', score: 870, name: 'GUEST', message: '', date: '2026-03-09' },
    { game: 'TETRIS', score: 760, name: 'NOOB', message: '', date: '2026-03-07' }
];'''

js = re.sub(r'const seedHighScores = \[[^\]]*\];', new_seeds, js)

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Seed data updated.')
