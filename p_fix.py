import re

with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace("this.ctx.fillStyle = '#0a0a0f'; // NO TRAILS!\n        this.ctx.fillRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);", "this.ctx.clearRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);")

js = re.sub(
    r"this\.ctx\.fillStyle = 'rgba\(10,\s*10,\s*15,\s*0\.3\)';\s*this\.ctx\.fillRect\(0,\s*0,\s*this\.engine\.canvas\.width,\s*this\.engine\.canvas\.height\);",
    "this.ctx.clearRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);",
    js
)

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Done python fix")
