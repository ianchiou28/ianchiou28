/**
 * THE ARCADE - Ian Chiou Portfolio
 * Game Field Edition
 */

// ===== Photo Gallery =====
const photoFiles = [
    '398F4B76063E21DBF733B04F0B0815EB.png',
    '035C3812064D1C3CD3B965EE110BF2AF.png',
    '0BB45A2C4E17FF76E7E63E6376810E17.png',
    '2704BE589D4EEEC08005BF45B454E0F0.png',
    'C3AC2C8F9017CCE855D922838428AF3F.png',
    'F9074AED6FDD7AF87D3B5A38DF33CDBE.png'
];

// ===== DOM Elements =====
const terminalBtn = document.getElementById('terminal-btn');
const terminalModal = document.getElementById('terminal-modal');
const terminalOverlay = document.getElementById('terminal-overlay');
const closeTerminal = document.getElementById('close-terminal');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const gameCanvas = document.getElementById('game-canvas');
const gameUI = document.getElementById('game-ui');
const gameScoreEl = document.getElementById('game-score');
const gameLevelEl = document.getElementById('game-level');
const exitGameBtn = document.getElementById('exit-game');
const gameInstructions = document.getElementById('game-instructions');
const gameInstructionsIcon = document.getElementById('game-icon');
const gameInstructionsTitle = document.getElementById('game-title');
const gameInstructionsDesc = document.getElementById('game-desc');
const gameInstructionsControls = document.getElementById('game-controls');
const startGameBtn = document.getElementById('start-game-btn');
const highScoresBoardEl = document.getElementById('high-scores-board');
const highScoreFiltersEl = document.getElementById('high-score-filters');
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');

// ===== Theme Mode =====
const THEME_STORAGE_KEY = 'arcadeThemeV1';

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('theme-dark', isDark);

    const label = isDark ? 'LIGHT MODE' : 'DARK MODE';
    if (themeToggleBtn) themeToggleBtn.textContent = label;
    if (themeToggleMobileBtn) themeToggleMobileBtn.textContent = label;
}

function initThemeToggle() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    applyTheme(savedTheme);

    const onToggle = () => {
        const nextTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
    };

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', onToggle);
    }

    if (themeToggleMobileBtn) {
        themeToggleMobileBtn.addEventListener('click', onToggle);
    }
}

// ===== High Score Database =====
const HIGH_SCORE_STORAGE_KEY = 'arcadeHighScoresV2';
const seedHighScores = [
    { game: 'PACMAN', score: 1420, name: 'IAN', message: '', date: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
    { game: 'GUEST', score: '-', name: 'ALICE', message: '', date: new Date(Date.now() - 4*24*60*60*1000).toISOString() },
    { game: 'TETRIS', score: 1200, name: 'TREE', message: '', date: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
    { game: 'GUEST', score: '-', name: 'BOB', message: '', date: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
    { game: 'SNAKE', score: 980, name: 'AAA', message: '', date: '2026-03-08' },
    { game: 'PACMAN', score: 870, name: 'GUEST', message: '', date: '2026-03-09' },
    { game: 'TETRIS', score: 760, name: 'NOOB', message: '', date: '2026-03-07' }
];

let highScores = loadHighScores();
let currentScoreFilter = 'GUEST';

function loadHighScores() {
    try {
        const fromStorage = localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
        if (!fromStorage) {
            return [...seedHighScores];
        }

        const parsed = JSON.parse(fromStorage);
        if (!Array.isArray(parsed) || parsed.length === 0) {
            return [...seedHighScores];
        }

        return parsed
            .filter(item => item && item.game && Number.isFinite(item.score))
            .map(item => ({
                game: String(item.game).toUpperCase(),
                score: Number(item.score),
                date: item.date || new Date().toISOString().slice(0, 10)
            }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10);
    } catch (error) {
        return [...seedHighScores];
    }
}

function saveHighScores() {
    localStorage.setItem(HIGH_SCORE_STORAGE_KEY, JSON.stringify(highScores));
}


document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('score-name-input');
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
    }
});


function renderHighScores() {
    if (!highScoresBoardEl) return;

    
    const filteredScores = highScores.filter(record => record.game === currentScoreFilter);

    // If it's a game, sort by score descending. If it's GUEST, keep date descending.
    if (currentScoreFilter !== 'GUEST') {
        filteredScores.sort((a, b) => b.score - a.score);
    } else {
        filteredScores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }


    renderStickyNotes();
    if (!filteredScores.length) {
        highScoresBoardEl.innerHTML = '<div class="text-xs text-gray-text font-mono">暂无记录，先去打一局吧。</div>';
        return;
    }

    const rankColor = (rank) => {
        if (rank === 1) return 'text-neon-yellow';
        if (rank === 2) return 'text-neon-blue';
        if (rank === 3) return 'text-neon-pink';
        return 'text-gray-text';
    };

    highScoresBoardEl.innerHTML = filteredScores
        .map((record, index) => {
            const rank = index + 1;
            return `
                <div class="score-row">
                    <div class="score-rank ${rankColor(rank)}">#${rank}</div>   
                    <div>
                        <div class="font-pixel text-xs text-cool-white">${record.game}</div>
                        <div class="score-meta">DATE </div>       
                    </div>
                    <div class="flex flex-col gap-1 overflow-hidden">
                        <div class="font-mono text-xs text-neon-blue truncate">${record.name || 'ANON'}</div>
                        <div class="font-mono text-[10px] text-gray-text truncate">${record.message || '-'}</div>
                    </div>
                    <div class="score-value">${record.score === '-' ? '<span class="text-xs text-gray-500">留言</span>' : record.score}</div>
                </div>
            `;
        })
        .join('');
    
    
}


function renderStickyNotes() {
    const wall = document.getElementById('sticky-notes-wall');
    if (!wall) return;

    // Filter to only entries with actual messages (not default)
    const notes = highScores.filter(r => r.message && r.message.trim() !== '' && r.message !== '-' && r.message !== 'No message left.');

    if (notes.length === 0) {
        wall.innerHTML = '<div class="text-gray-text font-mono text-xs opacity-50">还没有人留下小纸条...</div>';
        return;
    }

    const colors = [
        'bg-yellow-200 text-yellow-900 shadow-[2px_4px_10px_rgba(253,224,71,0.3)]', 
        'bg-pink-200 text-pink-900 shadow-[2px_4px_10px_rgba(249,168,212,0.3)]', 
        'bg-green-200 text-green-900 shadow-[2px_4px_10px_rgba(134,239,172,0.3)]', 
        'bg-blue-200 text-blue-900 shadow-[2px_4px_10px_rgba(147,197,253,0.3)]',
        'bg-purple-200 text-purple-900 shadow-[2px_4px_10px_rgba(216,180,254,0.3)]'
    ];

    // Shuffle and pick elements for display
    wall.innerHTML = notes.map((record, i) => {
        // Randomly tilt between -8deg and +8deg
        const tilt = (Math.random() * 16 - 8).toFixed(1);
        const colorClass = colors[i % colors.length];
        // Random slight vertical offset
        const yOffset = (Math.random() * 20 - 10).toFixed(1);

        return `
            <div 
                class="w-48 min-h-[140px] p-4 flex flex-col justify-between transition-transform duration-300 hover:scale-110 hover:z-20 cursor-default rounded-sm relative ${colorClass}"
                style="transform: rotate(${tilt}deg) translateY(${yOffset}px);"
            >
                <!-- Tape effect at the top -->
                <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/40 backdrop-blur-sm shadow-sm rotate-2"></div>
                
                <p class="font-sans text-sm font-semibold leading-relaxed break-words">"${record.message}"</p>
                <div class="mt-4 pt-2 border-t border-black/10 flex justify-between items-center">
                    <span class="font-mono text-xs font-bold font-pixel">${record.name || 'ANON'}</span>
                    <span class="text-[10px] opacity-60">${record.game}</span>
                </div>
            </div>
        `;
    }).join('');
}

function initHighScoreFilters() {
    if (!highScoreFiltersEl) return;

    const buttons = highScoreFiltersEl.querySelectorAll('.score-filter-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            currentScoreFilter = button.dataset.game || 'GUEST';
            buttons.forEach(btn => btn.classList.remove('is-active'));
            button.classList.add('is-active');
            renderHighScores();
        });
    });
}

// ===== Typewriter Effect =====
const typewriterTexts = [
    'PLAYER 1 READY',
    'GAME START',
    'PRESS START',
    'FREE PLAY'
];
let typewriterIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById('typewriter');

function typeWriter() {
    const currentText = typewriterTexts[typewriterIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        typewriterIndex = (typewriterIndex + 1) % typewriterTexts.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeWriter, typeSpeed);
}

// ===== Photo Gallery Renderer - Slider =====
let currentSlide = 0;
let totalSlides = 0;

function renderPhotoGallery() {
    const slider = document.getElementById('photo-slider');
    const currentEl = document.getElementById('current-photo');
    const totalEl = document.getElementById('total-photos');
    
    if (!slider) return;
    
    slider.innerHTML = '';
    
    if (!photoFiles || photoFiles.length === 0) {
        showPhotoUploadGuide(slider);
        if (totalEl) totalEl.textContent = '0';
        return;
    }
    
    totalSlides = photoFiles.length;
    if (totalEl) totalEl.textContent = totalSlides;
    
    photoFiles.forEach((filename, index) => {
        const slide = document.createElement('div');
        slide.className = 'photo-slide';
        slide.innerHTML = `
            <img src="pictures/${filename}" alt="照片 ${index + 1}" 
                 loading="lazy"
                 onerror="this.parentElement.innerHTML='<div class=\\'photo-slide-placeholder\\'><span class=\\'text-4xl\\'>📷</span></div>'"
                 onload="this.style.opacity='1'"
                 style="opacity: 0; transition: opacity 0.5s ease;">
        `;
        slider.appendChild(slide);
    });
    
    initSliderControls();
}

function initSliderControls() {
    const slider = document.getElementById('photo-slider');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const currentEl = document.getElementById('current-photo');
    
    if (!slider) return;
    
    const updateCounter = () => {
        const slideWidth = slider.querySelector('.photo-slide')?.offsetWidth || 0;
        const scrollLeft = slider.scrollLeft;
        currentSlide = Math.round(scrollLeft / (slideWidth + 20)) + 1;
        if (currentEl) currentEl.textContent = Math.min(currentSlide, totalSlides);
        
        if (prevBtn) prevBtn.disabled = currentSlide <= 1;
        if (nextBtn) nextBtn.disabled = currentSlide >= totalSlides;
    };
    
    slider.addEventListener('scroll', updateCounter, { passive: true });
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const slideWidth = slider.querySelector('.photo-slide')?.offsetWidth || 0;
            slider.scrollBy({ left: -(slideWidth + 20), behavior: 'smooth' });
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const slideWidth = slider.querySelector('.photo-slide')?.offsetWidth || 0;
            slider.scrollBy({ left: slideWidth + 20, behavior: 'smooth' });
        });
    }
    
    // Touch/Mouse drag support
    let isDown = false;
    let startX;
    let scrollLeft;
    
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    
    slider.addEventListener('mouseleave', () => isDown = false);
    slider.addEventListener('mouseup', () => isDown = false);
    
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
    
    setTimeout(updateCounter, 100);
}

function showPhotoUploadGuide(container) {
    container.innerHTML = `
        <div class="photo-slide">
            <div class="photo-slide-placeholder">
                <div class="text-center p-8">
                    <div class="text-6xl mb-4">📸</div>
                    <p class="text-gray-text font-mono text-sm">把照片放入 /pictures 文件夹</p>
                    <p class="text-gray-text font-mono text-xs mt-2">并在 main.js 中配置 photoFiles</p>
                </div>
            </div>
        </div>
    `;
}

// ===== Game Engine =====
class GameEngine {
    constructor() {
        this.canvas = gameCanvas;
        this.ctx = this.canvas.getContext('2d');
        this.currentGame = null;
        this.currentGameInstance = null;
        this.isRunning = false;
        this.score = 0;
        this.level = 1;
        this.gameLoop = null;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        if (this.canvas.parentElement && this.canvas.parentElement.clientWidth > 0) {
            this.canvas.width = this.canvas.parentElement.clientWidth;
            this.canvas.height = this.canvas.parentElement.clientHeight;
        } else {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }
    
    start(gameType) {
        this.stop();
        this.currentGame = gameType;
        this.score = 0;
        this.level = 1;
        this.isRunning = true;
        
        const overlay = document.getElementById('game-overlay');
        if(overlay) { overlay.classList.remove('hidden'); overlay.classList.add('flex'); }
        this.canvas.classList.remove('hidden');
        gameUI.classList.remove('hidden');
        // Resize after displaying so clientWidth is correct
        this.resize();
        gameUI.classList.add('flex');
        this.updateUI();

        let instance = null;
        
        switch(gameType) {
            case 'snake':
                instance = new SnakeGame(this);
                break;
            case 'tetris':
                instance = new TetrisGame(this);
                break;
            case 'pacman':
                instance = new PacmanGame(this);
                break;
        }

        this.currentGameInstance = instance;
        if (this.currentGameInstance) {
            this.currentGameInstance.start();
        }
    }
    
    stop() {
        this.isRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }

        if (this.currentGameInstance && typeof this.currentGameInstance.cleanup === 'function') {
            this.currentGameInstance.cleanup();
        }

        this.currentGameInstance = null;
        const overlay = document.getElementById('game-overlay');
        if(overlay) { overlay.classList.add('hidden'); overlay.classList.remove('flex'); }
        this.canvas.classList.add('hidden');
        gameUI.classList.add('hidden');
        gameUI.classList.remove('flex');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    updateUI() {
        gameScoreEl.textContent = this.score;
        gameLevelEl.textContent = this.level;
    }
    
    addScore(points) {
        this.score += points;
        this.updateUI();
    }
    
    levelUp() {
        this.level++;
        this.updateUI();
    }
}

// ===== Snake Game =====
class SnakeGame {
    constructor(engine) {
        this.engine = engine;
        this.ctx = engine.ctx;
        this.gridSize = 20;
        this.tileCount = {
            x: Math.floor(engine.canvas.width / this.gridSize),
            y: Math.floor(engine.canvas.height / this.gridSize)
        };
        
        this.snake = [];
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.food = null;
        this.speed = 200;
        this.foodEmojis = ['🍎', '💰', '📈', '🏦', '💎', '🎯', '🚀', '⭐'];
        this.currentEmoji = '🍎';
        
        this.handleKeydown = this.handleKeydown.bind(this);
    }
    
    start() {
        this.snake = [
            {x: Math.floor(this.tileCount.x / 2), y: Math.floor(this.tileCount.y / 2)}
        ];
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.food = this.generateFood();
        this.speed = 200;
        
        document.addEventListener('keydown', this.handleKeydown);
        exitGameBtn.onclick = () => this.engine.stop();
        
        this.engine.gameLoop = setInterval(() => this.update(), this.speed);
        this.draw();
    }
    
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.tileCount.x),
                y: Math.floor(Math.random() * this.tileCount.y)
            };
        } while (this.snake.some(s => s.x === food.x && s.y === food.y));
        
        this.currentEmoji = this.foodEmojis[Math.floor(Math.random() * this.foodEmojis.length)];
        return food;
    }
    
    handleKeydown(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
        
        if (e.key === 'Escape') {
            this.engine.stop();
            return;
        }
        
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (this.direction.y === 0) this.nextDirection = {x: 0, y: -1};
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (this.direction.y === 0) this.nextDirection = {x: 0, y: 1};
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (this.direction.x === 0) this.nextDirection = {x: -1, y: 0};
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (this.direction.x === 0) this.nextDirection = {x: 1, y: 0};
                break;
        }
    }
    
    update() {
        this.direction = this.nextDirection;
        
        const head = {
            x: this.snake[0].x + this.direction.x,
            y: this.snake[0].y + this.direction.y
        };
        
        // Wrap around
        if (head.x < 0) head.x = this.tileCount.x - 1;
        if (head.x >= this.tileCount.x) head.x = 0;
        if (head.y < 0) head.y = this.tileCount.y - 1;
        if (head.y >= this.tileCount.y) head.y = 0;
        
        // Self collision
        if (this.snake.some(s => s.x === head.x && s.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Eat food
        if (head.x === this.food.x && head.y === this.food.y) {
            this.engine.addScore(10);
            this.food = this.generateFood();
            
            if (this.speed > 80) {
                this.speed -= 2;
                clearInterval(this.engine.gameLoop);
                this.engine.gameLoop = setInterval(() => this.update(), this.speed);
            }
        } else {
            this.snake.pop();
        }
        
        this.draw();
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
        
        this.snake.forEach((segment, index) => {
            const x = segment.x * this.gridSize;
            const y = segment.y * this.gridSize;
            
            if (index === 0) {
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = '#39ff14';
                this.ctx.fillStyle = '#39ff14';
            } else {
                const alpha = 1 - (index / this.snake.length) * 0.6;
                this.ctx.shadowBlur = 0;
                this.ctx.fillStyle = `rgba(57, 255, 20, ${alpha})`;
            }
            
            this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
        });
        
        this.ctx.shadowBlur = 0;
        
        const foodX = this.food.x * this.gridSize;
        const foodY = this.food.y * this.gridSize;
        this.ctx.font = `${this.gridSize}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#ff6b35';
        this.ctx.fillText(
            this.currentEmoji,
            foodX + this.gridSize / 2,
            foodY + this.gridSize / 2
        );
    }
    
    gameOver() {
        clearInterval(this.engine.gameLoop);
        document.removeEventListener('keydown', this.handleKeydown);
        
        
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.9)';
        this.ctx.fillRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
        
        this.ctx.fillStyle = '#ff006e';
        this.ctx.font = 'bold 48px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.engine.canvas.width / 2, this.engine.canvas.height / 2 - 50);
        
        this.ctx.font = '24px "Space Grotesk"';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`SCORE: ${this.engine.score}`, this.engine.canvas.width / 2, this.engine.canvas.height / 2 + 20);
        
        const restartHandler = (e) => {
            if (e.key === ' ') {
                document.removeEventListener('keydown', restartHandler);
                this.engine.start('snake');
            }
        };
        document.addEventListener('keydown', restartHandler);
    }
}

// ===== Tetris Game =====
class TetrisGame {
    constructor(engine) {
        this.engine = engine;
        this.ctx = engine.ctx;
        this.blockSize = 30;
        this.boardWidth = 10;
        this.boardHeight = 20;
        this.board = [];
        
        this.pieces = [
            [[1,1,1,1]],
            [[1,1],[1,1]],
            [[0,1,0],[1,1,1]],
            [[1,0,0],[1,1,1]],
            [[0,0,1],[1,1,1]],
            [[0,1,1],[1,1,0]],
            [[1,1,0],[0,1,1]]
        ];
        
        this.colors = ['#00f5ff', '#ffff00', '#bc13fe', '#ff6b35', '#0066ff', '#39ff14', '#ff006e'];
        
        this.currentPiece = null;
        this.currentX = 0;
        this.currentY = 0;
        this.currentColor = '';
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        
        this.handleKeydown = this.handleKeydown.bind(this);
        this.update = this.update.bind(this);
    }
    
    start() {
        this.board = Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(0));
        this.spawnPiece();
        this.dropInterval = 1000;
        
        document.addEventListener('keydown', this.handleKeydown);
        exitGameBtn.onclick = () => this.engine.stop();
        
        this.lastTime = performance.now();
        requestAnimationFrame(this.update);
    }
    
    spawnPiece() {
        const pieceIndex = Math.floor(Math.random() * this.pieces.length);
        this.currentPiece = this.pieces[pieceIndex];
        this.currentColor = this.colors[pieceIndex];
        this.currentX = Math.floor(this.boardWidth / 2) - Math.floor(this.currentPiece[0].length / 2);
        this.currentY = 0;
        
        if (this.collision()) {
            this.gameOver();
        }
    }
    
    collision() {
        for (let y = 0; y < this.currentPiece.length; y++) {
            for (let x = 0; x < this.currentPiece[y].length; x++) {
                if (this.currentPiece[y][x]) {
                    const boardX = this.currentX + x;
                    const boardY = this.currentY + y;
                    
                    if (boardX < 0 || boardX >= this.boardWidth || boardY >= this.boardHeight) {
                        return true;
                    }
                    if (boardY >= 0 && this.board[boardY][boardX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    merge() {
        for (let y = 0; y < this.currentPiece.length; y++) {
            for (let x = 0; x < this.currentPiece[y].length; x++) {
                if (this.currentPiece[y][x]) {
                    const boardY = this.currentY + y;
                    if (boardY >= 0) {
                        this.board[boardY][this.currentX + x] = this.currentColor;
                    }
                }
            }
        }
    }
    
    rotate() {
        const rotated = this.currentPiece[0].map((_, i) =>
            this.currentPiece.map(row => row[i]).reverse()
        );
        
        const oldPiece = this.currentPiece;
        this.currentPiece = rotated;
        
        if (this.collision()) {
            this.currentPiece = oldPiece;
        }
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.boardHeight - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.boardWidth).fill(0));
                linesCleared++;
                y++;
            }
        }
        
        if (linesCleared > 0) {
            this.engine.addScore(linesCleared * 100);
            if (this.engine.score % 1000 === 0) {
                this.engine.levelUp();
                this.dropInterval = Math.max(100, 1000 - (this.engine.level - 1) * 100);
            }
        }
    }
    
    handleKeydown(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
        
        if (e.key === 'Escape') {
            this.engine.stop();
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
                this.currentX--;
                if (this.collision()) this.currentX++;
                break;
            case 'ArrowRight':
            case 'd':
                this.currentX++;
                if (this.collision()) this.currentX--;
                break;
            case 'ArrowDown':
            case 's':
                this.currentY++;
                if (this.collision()) {
                    this.currentY--;
                    this.merge();
                    this.clearLines();
                    this.spawnPiece();
                }
                break;
            case 'ArrowUp':
            case 'w':
                this.rotate();
                break;
        }
    }
    
    update(time = performance.now()) {
        if (!this.engine.isRunning || this.engine.currentGame !== 'tetris') return;
        
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        
        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.currentY++;
            if (this.collision()) {
                this.currentY--;
                this.merge();
                this.clearLines();
                this.spawnPiece();
            }
            this.dropCounter = 0;
        }
        
        this.draw();
        requestAnimationFrame(this.update);
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
        
        const offsetX = (this.engine.canvas.width - this.boardWidth * this.blockSize) / 2;
        const offsetY = (this.engine.canvas.height - this.boardHeight * this.blockSize) / 2;
        
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                const px = offsetX + x * this.blockSize;
                const py = offsetY + y * this.blockSize;
                
                if (this.board[y][x]) {
                    this.ctx.fillStyle = this.board[y][x];
                    this.ctx.shadowBlur = 10;
                    this.ctx.shadowColor = this.board[y][x];
                    this.ctx.fillRect(px + 1, py + 1, this.blockSize - 2, this.blockSize - 2);
                } else {
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
                    this.ctx.shadowBlur = 0;
                    this.ctx.fillRect(px + 1, py + 1, this.blockSize - 2, this.blockSize - 2);
                }
            }
        }
        
        this.ctx.shadowBlur = 0;
        
        this.ctx.fillStyle = this.currentColor;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = this.currentColor;
        
        for (let y = 0; y < this.currentPiece.length; y++) {
            for (let x = 0; x < this.currentPiece[y].length; x++) {
                if (this.currentPiece[y][x]) {
                    const px = offsetX + (this.currentX + x) * this.blockSize;
                    const py = offsetY + (this.currentY + y) * this.blockSize;
                    if (py >= offsetY) {
                        this.ctx.fillRect(px + 1, py + 1, this.blockSize - 2, this.blockSize - 2);
                    }
                }
            }
        }
        
        this.ctx.shadowBlur = 0;
    }
    
    gameOver() {
        this.engine.isRunning = false;
        document.removeEventListener('keydown', this.handleKeydown);
        
        
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.9)';
        this.ctx.fillRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
        
        this.ctx.fillStyle = '#ff006e';
        this.ctx.font = 'bold 48px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.engine.canvas.width / 2, this.engine.canvas.height / 2 - 50);
        
        this.ctx.font = '24px "Space Grotesk"';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`SCORE: ${this.engine.score}`, this.engine.canvas.width / 2, this.engine.canvas.height / 2 + 20);
        
        const restartHandler = (e) => {
            if (e.key === ' ') {
                document.removeEventListener('keydown', restartHandler);
                this.engine.start('tetris');
            }
        };
        document.addEventListener('keydown', restartHandler);
    }
}

// ===== Pacman Game =====
class PacmanGame {
    constructor(engine) {
        this.engine = engine;
        this.ctx = engine.ctx;
        this.tileSize = 25;
        this.pacman = { x: 1, y: 1, direction: 0, currentDirection: 0, nextDirection: 0 };
        this.ghosts = [];
        this.dots = [];
        this.powerPellets = [];
        this.speed = 150;
        this.restartHandler = null;
        this.tick = 0;
        this.scatterTargets = null;
        this.directions = [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 0, y: -1 }
        ];
        
        this.maze = [
            "############################",
            "#............##............#",
            "#.####.#####.##.#####.####.#",
            "#O####.#####.##.#####.####O#",
            "#.####.#####.##.#####.####.#",
            "#..........................#",
            "#.####.##.########.##.####.#",
            "#.####.##.########.##.####.#",
            "#......##....##....##......#",
            "######.##### ## #####.######",
            "     #.##### ## #####.#     ",
            "     #.##          ##.#     ",
            "     #.## ###--### ##.#     ",
            "######.## #      # ##.######",
            "      .   #      #   .      ",
            "######.## #      # ##.######",
            "     #.## ######## ##.#     ",
            "     #.##          ##.#     ",
            "     #.## ######## ##.#     ",
            "######.## ######## ##.######",
            "#............##............#",
            "#.####.#####.##.#####.####.#",
            "#.####.#####.##.#####.####.#",
            "#O..##.......  .......##..O#",
            "###.##.##.########.##.##.###",
            "###.##.##.########.##.##.###",
            "#......##....##....##......#",
            "#.##########.##.##########.#",
            "#.##########.##.##########.#",
            "#..........................#",
            "############################"
        ];
        
        this.handleKeydown = this.handleKeydown.bind(this);
    }

    get mazeWidth() {
        return this.maze[0].length;
    }

    get mazeHeight() {
        return this.maze.length;
    }
    
    start() {
        this.parseMaze();
        this.tick = 0;
        this.scatterTargets = {
            blinky: { x: this.mazeWidth - 2, y: 0 },
            pinky: { x: 1, y: 0 },
            inky: { x: this.mazeWidth - 2, y: this.mazeHeight - 1 },
            clyde: { x: 1, y: this.mazeHeight - 1 }
        };
        this.pacman = { x: 13, y: 23, direction: 0, currentDirection: 0, nextDirection: 0 };
        this.ghosts = [
            { x: 13, y: 11, color: '#ff0000', name: 'blinky', direction: 0 },
            { x: 12, y: 13, color: '#ffb8ff', name: 'pinky', direction: 2 },
            { x: 13, y: 13, color: '#00ffff', name: 'inky', direction: 1 },
            { x: 14, y: 13, color: '#ffb852', name: 'clyde', direction: 3 }
        ];
        
        document.addEventListener('keydown', this.handleKeydown);
        exitGameBtn.onclick = () => this.engine.stop();
        
        this.engine.gameLoop = setInterval(() => this.update(), this.speed);
        this.draw();
    }

    cleanup() {
        document.removeEventListener('keydown', this.handleKeydown);
        if (this.restartHandler) {
            document.removeEventListener('keydown', this.restartHandler);
            this.restartHandler = null;
        }
    }
    
    parseMaze() {
        this.dots = [];
        this.powerPellets = [];
        
        for (let y = 0; y < this.maze.length; y++) {
            for (let x = 0; x < this.maze[y].length; x++) {
                if (this.maze[y][x] === '.') {
                    this.dots.push({ x, y });
                } else if (this.maze[y][x] === 'O') {
                    this.powerPellets.push({ x, y });
                }
            }
        }
    }
    
    handleKeydown(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
        
        if (e.key === 'Escape') {
            this.engine.stop();
            return;
        }
        
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
                this.pacman.nextDirection = 3;
                break;
            case 'ArrowDown':
            case 's':
                this.pacman.nextDirection = 1;
                break;
            case 'ArrowLeft':
            case 'a':
                this.pacman.nextDirection = 2;
                break;
            case 'ArrowRight':
            case 'd':
                this.pacman.nextDirection = 0;
                break;
        }
    }

    normalizeX(x) {
        if (x < 0) return this.maze[0].length - 1;
        if (x >= this.maze[0].length) return 0;
        return x;
    }

    canMove(x, y) {
        if (y < 0 || y >= this.maze.length) return false;
        const normalizedX = this.normalizeX(x);
        return this.maze[y][normalizedX] !== '#';
    }

    moveEntity(entity, direction) {
        const movement = this.directions[direction];
        const nextX = this.normalizeX(entity.x + movement.x);
        const nextY = entity.y + movement.y;

        if (!this.canMove(nextX, nextY)) {
            return false;
        }

        entity.x = nextX;
        entity.y = nextY;
        entity.direction = direction;
        return true;
    }

    movePacman() {
        if (this.moveEntity(this.pacman, this.pacman.nextDirection)) {
            this.pacman.currentDirection = this.pacman.nextDirection;
            return;
        }

        this.moveEntity(this.pacman, this.pacman.currentDirection);
    }

    getTileAhead(origin, direction, steps = 4) {
        let x = origin.x;
        let y = origin.y;

        for (let i = 0; i < steps; i++) {
            const movement = this.directions[direction];
            x = this.normalizeX(x + movement.x);
            y += movement.y;
            if (!this.canMove(x, y)) {
                break;
            }
        }

        return { x, y };
    }

    getMode() {
        const cycle = this.tick % 220;
        return cycle < 45 ? 'scatter' : 'chase';
    }

    ghostTarget(ghost) {
        const mode = this.getMode();

        if (mode === 'scatter') {
            return this.scatterTargets[ghost.name] || { x: this.pacman.x, y: this.pacman.y };
        }

        if (ghost.name === 'blinky') {
            return { x: this.pacman.x, y: this.pacman.y };
        }

        if (ghost.name === 'pinky') {
            return this.getTileAhead(this.pacman, this.pacman.currentDirection, 4);
        }

        if (ghost.name === 'inky') {
            const blinky = this.ghosts.find(g => g.name === 'blinky') || ghost;
            const pacmanAhead = this.getTileAhead(this.pacman, this.pacman.currentDirection, 2);
            const vx = pacmanAhead.x - blinky.x;
            const vy = pacmanAhead.y - blinky.y;
            return {
                x: this.normalizeX(pacmanAhead.x + vx),
                y: pacmanAhead.y + vy
            };
        }

        if (ghost.name === 'clyde') {
            const distance = Math.abs(ghost.x - this.pacman.x) + Math.abs(ghost.y - this.pacman.y);
            if (distance > 8) {
                return { x: this.pacman.x, y: this.pacman.y };
            }
            return this.scatterTargets.clyde;
        }

        return { x: this.pacman.x, y: this.pacman.y };
    }

    moveGhost(ghost) {
        const reverseDirection = (ghost.direction + 2) % 4;
        let possibleDirections = [];

        for (let direction = 0; direction < this.directions.length; direction++) {
            const movement = this.directions[direction];
            const nextX = this.normalizeX(ghost.x + movement.x);
            const nextY = ghost.y + movement.y;
            if (this.canMove(nextX, nextY)) {
                possibleDirections.push(direction);
            }
        }

        if (possibleDirections.length > 1) {
            possibleDirections = possibleDirections.filter(direction => direction !== reverseDirection);
        }

        if (!possibleDirections.length) {
            return;
        }

        const target = this.ghostTarget(ghost);
        let chosenDirection = possibleDirections[0];
        let bestDistance = Infinity;

        possibleDirections.forEach(direction => {
            const movement = this.directions[direction];
            const candidateX = this.normalizeX(ghost.x + movement.x);
            const candidateY = ghost.y + movement.y;
            const distance = Math.abs(candidateX - target.x) + Math.abs(candidateY - target.y);
            if (distance < bestDistance) {
                bestDistance = distance;
                chosenDirection = direction;
            }
        });

        this.moveEntity(ghost, chosenDirection);
    }
    
    update() {
        this.tick++;
        this.movePacman();
        this.ghosts.forEach(ghost => this.moveGhost(ghost));
        
        if (this.ghosts.some(g => g.x === this.pacman.x && g.y === this.pacman.y)) {
            this.gameOver();
            return;
        }
        
        const dotIndex = this.dots.findIndex(d => d.x === this.pacman.x && d.y === this.pacman.y);
        if (dotIndex !== -1) {
            this.dots.splice(dotIndex, 1);
            this.engine.addScore(10);
        }
        
        const pelletIndex = this.powerPellets.findIndex(p => p.x === this.pacman.x && p.y === this.pacman.y);
        if (pelletIndex !== -1) {
            this.powerPellets.splice(pelletIndex, 1);
            this.engine.addScore(50);
        }
        
        if (this.dots.length === 0 && this.powerPellets.length === 0) {
            this.win();
            return;
        }
        
        this.draw();
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
        
        const offsetX = (this.engine.canvas.width - this.maze[0].length * this.tileSize) / 2;
        const offsetY = (this.engine.canvas.height - this.maze.length * this.tileSize) / 2;
        
        for (let y = 0; y < this.maze.length; y++) {
            for (let x = 0; x < this.maze[y].length; x++) {
                const px = offsetX + x * this.tileSize;
                const py = offsetY + y * this.tileSize;
                
                if (this.maze[y][x] === '#') {
                    this.ctx.fillStyle = '#21262d';
                    this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
                    this.ctx.strokeStyle = '#30363d';
                    this.ctx.strokeRect(px, py, this.tileSize, this.tileSize);
                }
            }
        }
        
        this.ctx.fillStyle = '#ffffff';
        this.dots.forEach(dot => {
            const px = offsetX + dot.x * this.tileSize + this.tileSize / 2;
            const py = offsetY + dot.y * this.tileSize + this.tileSize / 2;
            this.ctx.beginPath();
            this.ctx.arc(px, py, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.fillStyle = '#ffff00';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#ffff00';
        this.powerPellets.forEach(pellet => {
            const px = offsetX + pellet.x * this.tileSize + this.tileSize / 2;
            const py = offsetY + pellet.y * this.tileSize + this.tileSize / 2;
            this.ctx.beginPath();
            this.ctx.arc(px, py, 6, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.shadowBlur = 0;
        
        const pacmanX = offsetX + this.pacman.x * this.tileSize + this.tileSize / 2;
        const pacmanY = offsetY + this.pacman.y * this.tileSize + this.tileSize / 2;
        this.ctx.fillStyle = '#ffff00';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#ffff00';
        this.ctx.beginPath();
        let startAngle = 0.2 * Math.PI;
        let endAngle = 1.8 * Math.PI;
        if (this.pacman.direction === 1) { startAngle += Math.PI/2; endAngle += Math.PI/2; }
        if (this.pacman.direction === 2) { startAngle += Math.PI; endAngle += Math.PI; }
        if (this.pacman.direction === 3) { startAngle -= Math.PI/2; endAngle -= Math.PI/2; }
        this.ctx.arc(pacmanX, pacmanY, this.tileSize / 2 - 2, startAngle, endAngle);
        this.ctx.lineTo(pacmanX, pacmanY);
        this.ctx.fill();
        
        this.ghosts.forEach(ghost => {
            const gx = offsetX + ghost.x * this.tileSize + this.tileSize / 2;
            const gy = offsetY + ghost.y * this.tileSize + this.tileSize / 2;
            
            this.ctx.fillStyle = ghost.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = ghost.color;
            
            this.ctx.beginPath();
            this.ctx.arc(gx, gy - 3, this.tileSize / 2 - 2, Math.PI, 0);
            this.ctx.lineTo(gx + this.tileSize / 2 - 2, gy + this.tileSize / 2 - 2);
            for (let i = 0; i < 3; i++) {
                this.ctx.lineTo(gx + this.tileSize / 2 - 2 - (i + 1) * (this.tileSize / 3), gy + this.tileSize / 4);
            }
            this.ctx.lineTo(gx - this.tileSize / 2 + 2, gy + this.tileSize / 2 - 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(gx - 4, gy - 4, 3, 0, Math.PI * 2);
            this.ctx.arc(gx + 4, gy - 4, 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#0000ff';
            this.ctx.beginPath();
            this.ctx.arc(gx - 4, gy - 4, 1.5, 0, Math.PI * 2);
            this.ctx.arc(gx + 4, gy - 4, 1.5, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.shadowBlur = 0;
    }
    
    win() {
        clearInterval(this.engine.gameLoop);
        this.engine.isRunning = false;
        this.cleanup();
        
        
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.82)';
        this.ctx.fillRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
        
        this.ctx.fillStyle = '#39ff14';
        this.ctx.font = 'bold 48px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('YOU WIN!', this.engine.canvas.width / 2, this.engine.canvas.height / 2 - 50);
        
        this.ctx.font = '24px "Space Grotesk"';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`FINAL SCORE: ${this.engine.score}`, this.engine.canvas.width / 2, this.engine.canvas.height / 2 + 20);
        this.restartHandler = (e) => {
            if (e.key === ' ') {
                document.removeEventListener('keydown', this.restartHandler);
                this.restartHandler = null;
                this.engine.start('pacman');
            }
        };
        document.addEventListener('keydown', this.restartHandler);
    }
    
    gameOver() {
        clearInterval(this.engine.gameLoop);
        this.engine.isRunning = false;
        this.cleanup();
        
        
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.82)';
        this.ctx.fillRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
        
        this.ctx.fillStyle = '#ff006e';
        this.ctx.font = 'bold 48px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.engine.canvas.width / 2, this.engine.canvas.height / 2 - 50);
        
        this.ctx.font = '24px "Space Grotesk"';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`SCORE: ${this.engine.score}`, this.engine.canvas.width / 2, this.engine.canvas.height / 2 + 20);
        
        this.restartHandler = (e) => {
            if (e.key === ' ') {
                document.removeEventListener('keydown', this.restartHandler);
                this.restartHandler = null;
                this.engine.start('pacman');
            }
        };
        document.addEventListener('keydown', this.restartHandler);
    }
}

const gameEngine = new GameEngine();

// ===== Game Starters =====
function startSnakeGame() {
    showGameInstructions('snake', '🐍', 'SNAKE', '经典贪吃蛇游戏', [
        '方向键 / WASD - 移动',
        'ESC - 退出游戏',
        '吃到食物得分，不要撞到自己'
    ]);
}

function startTetrisGame() {
    showGameInstructions('tetris', '🧱', 'TETRIS', '俄罗斯方块', [
        '方向键 / WASD - 移动和旋转',
        '下键 - 加速下落',
        'ESC - 退出游戏',
        '消除行得分'
    ]);
}

function startPacmanGame() {
    showGameInstructions('pacman', '👾', 'PACMAN', '经典吃豆人', [
        '方向键 / WASD - 设定方向后持续移动',
        'ESC - 退出游戏',
        '吃掉所有豆子获胜，幽灵会主动追击'
    ]);
}

function showGameInstructions(gameType, icon, title, desc, controls) {
    gameInstructionsIcon.textContent = icon;
    gameInstructionsTitle.textContent = title;
    gameInstructionsDesc.textContent = desc;
    gameInstructionsControls.innerHTML = controls.map(c => `<div>${c}</div>`).join('');
    gameInstructions.classList.remove('hidden');
    gameInstructions.classList.add('flex');
    
    startGameBtn.onclick = () => {
        gameInstructions.classList.add('hidden');
        gameInstructions.classList.remove('flex');
        gameEngine.start(gameType);
    };
}

// ===== Terminal Mode =====
const terminalCommands = {
    help: () => `🎮 <span class="text-neon-green">ARCADE COMMANDS</span>

<span class="text-neon-blue">GAMES:</span>
  <span class="text-primary">snake</span>    - 启动贪吃蛇
  <span class="text-primary">tetris</span>   - 启动俄罗斯方块  
  <span class="text-primary">pacman</span>   - 启动吃豆人

<span class="text-neon-blue">INFO:</span>
  <span class="text-neon-green">whoami</span>   - 关于我
  <span class="text-neon-green">ls</span>       - 列出项目
  <span class="text-neon-green">skills</span>   - 技能树
  <span class="text-neon-green">contact</span>  - 联系方式
  <span class="text-neon-green">photos</span>   - 跳转到相册

<span class="text-neon-blue">SYSTEM:</span>
  <span class="text-neon-yellow">clear</span>    - 清屏
  <span class="text-neon-yellow">exit</span>     - 关闭终端`,
    
    whoami: () => `<span class="text-neon-green">╔══════════════════════════════════╗</span>
<span class="text-neon-green">║</span>  <span class="text-cool-white">PLAYER 1: Ian Chiou</span>             <span class="text-neon-green">║</span>
<span class="text-neon-green">║</span>  <span class="text-gray-text">Guild: Nanjing University</span>       <span class="text-neon-green">║</span>
<span class="text-neon-green">║</span>  <span class="text-gray-text">Class: Digital Economics</span>        <span class="text-neon-green">║</span>
<span class="text-neon-green">║</span>  <span class="text-primary">Focus: FinTech & Quant</span>        <span class="text-neon-green">║</span>
<span class="text-neon-green">╚══════════════════════════════════╝</span>`,
    
    ls: () => `<span class="text-primary">🕹️  ARCADE MACHINES:</span>

<span class="text-neon-blue">[MACHINE 1]</span>  FinAI/         - 金融 AI 平台
<span class="text-neon-purple">[MACHINE 2]</span>  ianchiou28/    - 个人开源
<span class="text-neon-green">[MACHINE 3]</span>  Lingsio/       - 组织项目

<span class="text-gray-text">Use 'start &lt;machine&gt;' to play</span>`,
    
    skills: () => `<span class="text-neon-green">SKILL TREE:</span>

Python      <span class="text-neon-green">████████████████████ 95%</span>
Quant       <span class="text-primary">██████████████████░░ 90%</span>
React       <span class="text-neon-blue">████████████████░░░░ 80%</span>
FinTech     <span class="text-neon-purple">██████████████████░░ 92%</span>`,
    
    contact: () => `<span class="text-neon-yellow">📡 CONTACT INFO:</span>

GitHub:   <span class="text-neon-blue">github.com/ianchiou28</span>
Org:      <span class="text-neon-purple">github.com/Lingsio</span>
Website:  <span class="text-primary">http://www.finai.org.cn/</span>

<span class="text-neon-green">READY TO CONNECT...</span>`,
    
    photos: () => {
        document.getElementById('photos').scrollIntoView({ behavior: 'smooth' });
        return '<span class="text-neon-purple">📸 正在打开相册...</span>';
    },
    
    snake: () => {
        closeTerminalModal();
        setTimeout(() => startSnakeGame(), 300);
        return '<span class="text-neon-green">🐍 正在启动贪吃蛇...</span>';
    },
    
    tetris: () => {
        closeTerminalModal();
        setTimeout(() => startTetrisGame(), 300);
        return '<span class="text-neon-blue">🧱 正在启动俄罗斯方块...</span>';
    },
    
    pacman: () => {
        closeTerminalModal();
        setTimeout(() => startPacmanGame(), 300);
        return '<span class="text-neon-yellow">👾 正在启动吃豆人...</span>';
    },
    
    clear: () => {
        terminalOutput.innerHTML = '';
        return null;
    },
    
    exit: () => {
        closeTerminalModal();
        return null;
    }
};

function openTerminal() {
    terminalModal.classList.remove('hidden');
    terminalModal.classList.add('flex');
    terminalInput.focus();
    addTerminalLine('<span class="text-neon-green">🎮 ARCADE TERMINAL v2.0</span>');
    addTerminalLine('<span class="text-gray-text">输入游戏名直接开始，或输入 help 查看命令</span>');
}

function closeTerminalModal() {
    terminalModal.classList.add('hidden');
    terminalModal.classList.remove('flex');
    terminalOutput.innerHTML = '';
}

function addTerminalLine(content) {
    const line = document.createElement('div');
    line.className = 'terminal-line mb-1';
    line.innerHTML = content;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function handleTerminalCommand(command) {
    const cmd = command.trim().toLowerCase();
    
    if (cmd === '') return;
    
    addTerminalLine(`<span class="text-neon-pink">➜</span> <span class="text-neon-yellow">~</span> ${cmd}`);
    
    if (terminalCommands[cmd]) {
        const result = terminalCommands[cmd]();
        if (result) {
            addTerminalLine(result);
        }
    } else {
        addTerminalLine(`<span class="text-neon-pink">❌ 未知命令: ${cmd}</span>`);
        addTerminalLine(`<span class="text-gray-text">输入 help 查看可用命令</span>`);
    }
}

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    typeWriter();
    renderPhotoGallery();
    initHighScoreFilters();
    renderHighScores();
    
    terminalBtn.addEventListener('click', openTerminal);
    closeTerminal.addEventListener('click', closeTerminalModal);
    terminalOverlay.addEventListener('click', closeTerminalModal);
    
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleTerminalCommand(terminalInput.value);
            terminalInput.value = '';
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            e.preventDefault();
            if (terminalModal.classList.contains('hidden')) {
                openTerminal();
            } else {
                closeTerminalModal();
            }
        }
    });
    
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});


// ===== BOOT SEQUENCE =====
function runBootSequence() {
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');
    if (!bootScreen || !bootText) return;

    const logs = [
        "BIOS DATE 03/15/26 14:22:15 VER 1.00",
        "CPU: IAN-ARCADE-CORE 3.0GHz",
        "Memory Test: 1048576K OK",
        "",
        "Loading system drivers...",
        "OK.",
        "Initializing Game State...",
        "OK.",
        "Mounting File System...",
        "OK.",
        "Loading Guestbook module...",
        "OK.",
        "",
        "SYSTEM READY.",
        "PRESS START TO CONTINUE..."
    ];

    let lineIndex = 0;
    
    function addLog() {
        if (lineIndex < logs.length) {
            bootText.textContent += logs[lineIndex] + "\n";
            lineIndex++;
            setTimeout(addLog, Math.random() * 150 + 50);
        } else {
            setTimeout(() => {
                bootScreen.style.opacity = '0';
                setTimeout(() => bootScreen.remove(), 1000);
            }, 800);
        }
    }
    
    setTimeout(addLog, 500);
}
document.addEventListener('DOMContentLoaded', runBootSequence);
