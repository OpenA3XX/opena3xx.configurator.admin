#!/bin/bash

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use the Node.js version specified in .nvmrc
if [ -f ".nvmrc" ]; then
    nvm use
else
    echo "No .nvmrc file found. Using default Node.js version."
    nvm use 18.20.8
fi

# Verify Angular CLI is available
if command -v npx &> /dev/null; then
    echo "Node.js version: $(node --version)"
    echo "npm version: $(npm --version)"
    echo "Angular CLI is available via 'npx ng'"
else
    echo "Error: npx is not available"
    exit 1
fi
