#!/bin/bash
# Design system is a dependency (@archera/design-system, pinned in package.json);
# npm install pulls it from GitHub — no sibling clone needed.
echo "Setting up Chat Agent..."
npm install
echo "Done. Run: npm run dev"
