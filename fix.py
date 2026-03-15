with open('main.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

start_idx = text.find("document.addEventListener('DOMContentLoaded', () => {")
# print('start_idx:', start_idx)

bad_block_start = text.find("const nameInput = document.getElementById('score-name-input');", start_idx)
bad_block_end = text.find("}, 2000);\n        });\n    }", bad_block_start)
if bad_block_end != -1:
    bad_block_end += len("}, 2000);\n        });\n    }")

# print('bad_block_start:', bad_block_start)
# print('bad_block_end:', bad_block_end)

if bad_block_start != -1 and bad_block_end != -1:
    old_code = text[bad_block_start:bad_block_end]
    new_code = '''const nameInput = document.getElementById('score-name-input');
    const messageInput = document.getElementById('score-message-input');
    const submitBtn = document.getElementById('score-submit-btn');

    const gbNameInput = document.getElementById('guestbook-name-input');
    const gbMessageInput = document.getElementById('guestbook-message-input');
    const gbSubmitBtn = document.getElementById('guestbook-submit-btn');

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const playerName = nameInput.value.trim().toUpperCase() || 'AAA';
            const playerMessage = messageInput.value.trim();

            highScores.push({
                game: currentScoreFilter === 'GUEST' ? 'GUEST' : currentScoreFilter,
                score: '-',
                name: playerName,
                message: playerMessage,
                date: new Date().toISOString()
            });

            highScores = highScores
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 50);

            saveHighScores();
            renderHighScores();

            if(nameInput) nameInput.value = '';
            if(messageInput) messageInput.value = '';

            submitBtn.textContent = '[ SUCCESS / 留言成功 ]';
            setTimeout(() => {
                submitBtn.textContent = '[ ADD RECORD / 提交留言 ]';
            }, 2000);
        });
    }

    if (gbSubmitBtn) {
        gbSubmitBtn.addEventListener('click', () => {
            const playerName = gbNameInput.value.trim().toUpperCase() || 'AAA';
            const playerMessage = gbMessageInput.value.trim();

            highScores.push({
                game: 'GUEST',
                score: '-',
                name: playerName,
                message: playerMessage,
                date: new Date().toISOString()
            });

            highScores = highScores
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 50);

            saveHighScores();
            renderHighScores();

            if(gbNameInput) gbNameInput.value = '';
            if(gbMessageInput) gbMessageInput.value = '';

            gbSubmitBtn.textContent = '[ SUCCESS / 留言成功 ]';
            setTimeout(() => {
                gbSubmitBtn.textContent = '[ ADD RECORD / 提交留言 ]';
            }, 2000);
        });
    }'''
    text = text.replace(old_code, new_code)
    with open('main.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("FIXED BLOCK.")
else:
    print("COULD NOT FIND BLOCK.")

