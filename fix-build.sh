#!/bin/bash

# Install missing packages
npm install clsx tailwind-merge
npm install -D @types/node

# Create vite-env.d.ts
cat > src/vite-env.d.ts << 'EOF'
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
EOF

# Commit
git add .
git commit -m "Fix TypeScript build errors"
git push

echo "✅ Fixed! Try building again."
