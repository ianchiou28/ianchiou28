with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Make sure sorting doesn't break if score is '-'
# A better approach: sort entirely by Date (newest first) instead of Score, 
# since it's a "Guestbook"! "留言墙".
js = js.replace('b.score - a.score', 'new Date(b.date).getTime() - new Date(a.date).getTime()')

# Actually, sorting by date might break classic high-score expectations if they wanted strictly scores, 
# but "留言墙" implies chronological order. Let's make it sort by score only if both are games, otherwise treat GUEST as super high score?
# Let's just use `(b.score === "-" ? 0 : b.score) - (a.score === "-" ? 0 : a.score)`.
js = js.replace('b.score - a.score', '(b.score === "-" ? 0 : b.score) - (a.score === "-" ? 0 : a.score)')

# Fix the renderHighScores to display the score or nothing
with open('main.js', 'w', encoding='utf-8') as f:
    f.write(js)
