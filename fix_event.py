with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace the submission handler logic to fix potential memory leak
old_handler = '''    const handleSubmit = () => {
        const playerName = nameInput.value.trim().toUpperCase() || 'AAA';  
        const playerMessage = messageInput.value.trim() || 'No message left.';

        highScores.push({
            game: gameName.toUpperCase(),
            score,
            name: playerName,
            message: playerMessage,
            date: new Date().toISOString().slice(0, 10)
        });

        highScores = highScores
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 50); // Keep top 50 in storage

        saveHighScores();
        renderHighScores();

        // Close modal
        modal.classList.add('opacity-0');
        modal.querySelector('.score-modal-content').classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);

        submitBtn.removeEventListener('click', handleSubmit);
    };

    submitBtn.addEventListener('click', handleSubmit);'''

new_handler = '''    const handleSubmit = () => {
        const playerName = nameInput.value.trim().toUpperCase() || 'AAA';  
        const playerMessage = messageInput.value.trim() || 'No message left.';

        highScores.push({
            game: gameName.toUpperCase(),
            score,
            name: playerName,
            message: playerMessage,
            date: new Date().toISOString().slice(0, 10)
        });

        highScores = highScores
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 50); // Keep top 50 in storage

        saveHighScores();
        renderHighScores();

        // Close modal
        modal.classList.add('opacity-0');
        modal.querySelector('.score-modal-content').classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };

    // Replace the button so old listeners are wiped
    const newSubmitBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
    newSubmitBtn.addEventListener('click', handleSubmit);'''

js = js.replace(old_handler, new_handler)

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(js)
