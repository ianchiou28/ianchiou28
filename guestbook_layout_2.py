import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove the modal html entirely:
text = re.sub(r'<!-- HIGH SCORE.*?<div id="score-modal"[\s\S]*?<!-- START SCREEN LAYER -->', '<!-- START SCREEN LAYER -->', text)

# 2. Get rid of the top nav links (it might look weird left at the top)
text = re.sub(r'<a href="javascript:openGuestbook\(\)"[^>]*>留言板</a>\s*', '', text)

# 3. Rewrite the HIGH SCORES section to be the new GUESTBOOK layout directly in the page
guestbook_html = '''    <!-- Guestbook Section -->
    <section id="guestbook" class="py-20 px-4">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-12">
                <h2 class="font-pixel text-xl md:text-2xl mb-4">
                    <span class="text-neon-purple">GUEST</span><span class="text-cool-white">BOOK 留言墙</span>
                </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-5 gap-8 glass-arcade rounded-3xl p-8">
                <!-- Submit Form -->
                <div class="md:col-span-2">
                    <h3 class="font-pixel text-sm text-neon-yellow mb-6">LEAVE A MESSAGE</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block font-mono text-xs text-neon-blue mb-1">PLAYER NAME (MAX 10)</label>
                            <input type="text" id="score-name-input" maxlength="10" placeholder="YOUR NAME" class="w-full bg-[#1a2332] border-2 border-neon-blue/50 text-[#fdfaf5] px-4 py-3 font-mono uppercase focus:outline-none focus:border-neon-blue focus:shadow-[0_0_15px_rgba(44,164,255,0.4)] transition-all">
                        </div>
                        <div>
                            <label class="block font-mono text-xs text-neon-purple mb-1">MESSAGE</label>
                            <input type="text" id="score-message-input" maxlength="40" placeholder="Say something... (Optional)" class="w-full bg-[#1a2332] border-2 border-neon-purple/50 text-[#fdfaf5] px-4 py-3 font-mono focus:outline-none focus:border-neon-purple focus:shadow-[0_0_15px_rgba(122,118,255,0.4)] transition-all">
                        </div>
                        <button id="score-submit-btn" class="w-full mt-4 py-4 bg-primary hover:bg-primary-glow text-white font-pixel text-sm tracking-widest transition-colors shadow-[0_0_20px_rgba(255,138,61,0.5)]">
                            [ ADD RECORD / 提交留言 ]
                        </button>
                    </div>
                </div>

                <!-- Leaderboard Display -->
                <div class="md:col-span-3">
                    <div class="mb-4 flex items-center justify-between">
                        <p class="text-xs text-cool-white font-mono">近期留言与高分记录</p>
                        <span class="text-[10px] text-neon-green font-mono">AUTO SAVE</span>
                    </div>
                    <div id="high-score-filters" class="mb-4 flex flex-wrap gap-2">
                        <button class="score-filter-btn is-active" data-game="ALL">ALL</button>
                        <button class="score-filter-btn" data-game="SNAKE">SNAKE</button>
                        <button class="score-filter-btn" data-game="TETRIS">TETRIS</button>
                        <button class="score-filter-btn" data-game="PACMAN">PACMAN</button>
                    </div>
                    <div id="high-scores-board" class="space-y-3 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        <!-- leaderboard rows rendered by JavaScript -->
                    </div>
                </div>
            </div>
        </div>
    </section>'''

# Replace the old opensource high-scores section
text = re.sub(r'<!-- GitHub Stats - Arcade Style -->[\s\S]*?</section>', guestbook_html, text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Instead of removing OpenGuestbook blindly, let's substitute it cleanly
init_logic = '''
document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('score-name-input');
    const messageInput = document.getElementById('score-message-input');
    const submitBtn = document.getElementById('score-submit-btn');

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const playerName = nameInput.value.trim().toUpperCase() || 'AAA';  
            const playerMessage = messageInput.value.trim() || 'No message left.';

            highScores.push({
                game: 'GUEST',
                score: '-',
                name: playerName,
                message: playerMessage,
                date: new Date().toISOString().slice(0, 10)
            });

            highScores = highScores
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 50); // Keep top 50 in storage

            saveHighScores();
            renderHighScores();
            
            if(nameInput) nameInput.value = '';
            if(messageInput) messageInput.value = '';
            
            // Highlight the form momentarily
            submitBtn.textContent = '[ SUCCESS / 留言成功 ]';
            setTimeout(() => {
                submitBtn.textContent = '[ ADD RECORD / 提交留言 ]';
            }, 2000);
        });
    }
});
'''

# We know openGuestbook starts at function openGuestbook() { let score = "-";...
# Find where it ends could be tricky. It's safe to just replace the whole text from `function openGuestbook() {` to the next function declaration `let currentScoreFilter` or `function renderHighScores()`.

js = re.sub(r'function openGuestbook\(\) \{[\s\S]*?(let currentScoreFilter|function renderHighScores)', r'' + init_logic + r'\n\n\1', js)

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Update completed!")
