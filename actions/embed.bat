@echo off

echo lel
npm run system-stopping
timeout 5

echo lel
npm run system-stopped
timeout 5

echo lel
npm run system-start
timeout 5

echo lel
npm run system-started
timeout 5

echo lel
npm run bot-stopping
timeout 5

echo lel
npm run bot-stopped
timeout 5

echo lel
npm run bot-start
timeout 5

echo lel
npm run bot-started
pause