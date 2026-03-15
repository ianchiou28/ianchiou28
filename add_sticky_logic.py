import re

with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Add a combined call
js = js.replace('        .join(\'\');\n}', '        .join(\'\');\n    \n    renderStickyNotes();\n}')

# Create the renderStickyNotes function
sticky_notes_fn = '''
function renderStickyNotes() {
    const wall = document.getElementById('sticky-notes-wall');
    if (!wall) return;

    // Filter to only entries with actual messages (not default)
    const notes = highScores.filter(r => r.message && r.message !== '-' && r.message !== 'No message left.');

    if (notes.length === 0) {
        wall.innerHTML = '<div class="text-gray-text font-mono text-xs opacity-50">还没有人留下小纸条...</div>';
        return;
    }

    const colors = [
        'bg-yellow-200 text-yellow-900 shadow-[2px_4px_10px_rgba(253,224,71,0.3)]', 
        'bg-pink-200 text-pink-900 shadow-[2px_4px_10px_rgba(24bc,165,165,0.3)]', 
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
                class="w-48 min-h-[140px] p-4 flex flex-col justify-between transition-transform duration-300 hover:scale-110 hover:z-20 cursor-default rounded-sm relative \\${colorClass}"
                style="transform: rotate(\\${tilt}deg) translateY(\\${yOffset}px);"
            >
                <!-- Tape effect at the top -->
                <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/40 backdrop-blur-sm shadow-sm rotate-2"></div>
                
                <p class="font-sans text-sm font-semibold leading-relaxed break-words">"\\${record.message}"</p>
                <div class="mt-4 pt-2 border-t border-black/10 flex justify-between items-center">
                    <span class="font-mono text-xs font-bold font-pixel">\\${record.name || 'ANON'}</span>
                    <span class="text-[10px] opacity-60">\\${record.game}</span>
                </div>
            </div>
        `;
    }).join('');
}
'''

# Use double backslashes in Python literal to keep one backslash for JS template literals
sticky_notes_fn = sticky_notes_fn.replace('\\${', '${')

js = js.replace('function initHighScoreFilters() {', sticky_notes_fn + '\nfunction initHighScoreFilters() {')

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Added sticky notes rendering logic.")
