import re

with open('main.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('arcadeHighScoresV1', 'arcadeHighScoresV2')

def clear_messages(match):
    sub_text = match.group(0)
    sub_text = re.sub(r"message: '[^']*'", "message: ''", sub_text)
    return sub_text

text = re.sub(r'const seedHighScores = \[.*?\];', clear_messages, text, flags=re.DOTALL)

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(text)

print('SUCCESS')
