import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

sticky_wall_html = '''            </div>

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
            </div>
        </div>
    </section>'''

html = html.replace('            </div>\n        </div>\n    </section>', sticky_wall_html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Updated HTML.')
