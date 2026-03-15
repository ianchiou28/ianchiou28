import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'\s*<!-- Sticky Notes Wall -->\s*<div class="mt-16 pt-8 border-t border-white/10 relative">\s*<div class="text-center mb-8">\s*<h3 class="font-pixel text-xl text-neon-pink animate-pulse">\s*WILD MESSAGES / 玩家便条纸\s*</h3>\s*<p class="text-xs text-gray-text font-mono mt-2">那些被贴在游戏厅墙上的涂鸦...</p>\s*</div>\s*<div id="sticky-notes-wall" class="flex flex-wrap justify-center items-start gap-8 p-4 min-h-\[200px\]">\s*<!-- Notes populated by JS -->\s*</div>\s*</div>'

clean_text = re.sub(pattern, '', text)

wall_code = '''

            <!-- Sticky Notes Wall -->
            <div class="mt-16 pt-8 border-t border-white/10 relative">
                <div class="text-center mb-8">
                    <h3 class="font-pixel text-xl text-neon-pink animate-pulse">
                        WILD MESSAGES / 玩家便条纸
                    </h3>
                    <p class="text-xs text-gray-text font-mono mt-2">那些被贴在游戏厅墙上的涂鸦...</p>
                </div>
                <div id="sticky-notes-wall" class="flex flex-wrap justify-center items-start gap-8 p-4 min-h-[200px]">
                    <!-- Notes populated by JS -->
                </div>
            </div>'''

# Now let's inject it into the correct spot. The guestbook section ends like this:
guestbook_end_pattern = r'(<div id="high-scores-board".*?</div>\s*</div>\s*</div>)\s*(</div>\s*</section>)'

match = re.search(guestbook_end_pattern, clean_text, re.DOTALL)
if match:
    new_text = clean_text[:match.start(1)] + match.group(1) + wall_code + '\n        ' + match.group(2) + clean_text[match.end(2):]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print('Successfully fixed index.html')
else:
    print('Could not find guestbook end pattern.')

