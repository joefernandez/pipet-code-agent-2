#bin/sh
curl -X POST -H "Content-Type: application/json" -d '{"model": "gemma2", "prompt": "roses are red", "stream": false }' http://localhost:11434/api/generate