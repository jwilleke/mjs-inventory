#!/bin/bash

# GitHub Push Script for mjs-inventory
# Automates the process of pushing code to GitHub

REPO_URL="https://github.com/jwilleke/mjs-inventory.git"
BRANCH="main"

echo "╔═══════════════════════════════════════════════════════╗"
echo "║   GitHub Push Script - mjs-inventory                  ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    echo "   Visit: https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git $(git --version | cut -d' ' -f3) detected"
echo ""

# Check if already a git repository
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git branch -M $BRANCH
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already initialized"
fi
echo ""

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "✅ Remote 'origin' already configured"
    CURRENT_REMOTE=$(git remote get-url origin)
    echo "   Current remote: $CURRENT_REMOTE"
    
    if [ "$CURRENT_REMOTE" != "$REPO_URL" ]; then
        echo "⚠️  Remote URL doesn't match expected repository"
        echo "   Expected: $REPO_URL"
        echo "   Current:  $CURRENT_REMOTE"
        read -p "   Update remote URL? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git remote set-url origin $REPO_URL
            echo "✅ Remote URL updated"
        fi
    fi
else
    echo "🔗 Adding remote repository..."
    git remote add origin $REPO_URL
    echo "✅ Remote 'origin' added: $REPO_URL"
fi
echo ""

# Stage all files
echo "📦 Staging files..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    echo "✅ Files staged"
    
    # Get commit message
    echo ""
    echo "Enter commit message (or press Enter for default):"
    read COMMIT_MSG
    
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="Update: $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    echo "📝 Committing changes..."
    git commit -m "$COMMIT_MSG"
    echo "✅ Changes committed"
fi
echo ""

# Check authentication
echo "🔐 Checking GitHub authentication..."
echo "   You may be prompted for credentials:"
echo "   - Username: your GitHub username"
echo "   - Password: use a Personal Access Token (not your GitHub password)"
echo ""
echo "   Don't have a token? Create one at:"
echo "   https://github.com/settings/tokens"
echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
if git push -u origin $BRANCH; then
    echo ""
    echo "╔═══════════════════════════════════════════════════════╗"
    echo "║   ✅ Successfully pushed to GitHub!                   ║"
    echo "╚═══════════════════════════════════════════════════════╝"
    echo ""
    echo "🌐 View your repository at:"
    echo "   $REPO_URL"
    echo ""
else
    echo ""
    echo "╔═══════════════════════════════════════════════════════╗"
    echo "║   ❌ Push failed                                      ║"
    echo "╚═══════════════════════════════════════════════════════╝"
    echo ""
    echo "Common issues:"
    echo "1. Authentication failed"
    echo "   - Use a Personal Access Token as password"
    echo "   - Or set up SSH keys"
    echo ""
    echo "2. Repository doesn't exist"
    echo "   - Create repository at: https://github.com/new"
    echo "   - Name it: mjs-inventory"
    echo ""
    echo "3. Permission denied"
    echo "   - Check you have write access to the repository"
    echo ""
    echo "For detailed help, see GITHUB-SETUP.md"
    exit 1
fi

# Offer to open in browser
if command -v open &> /dev/null; then
    read -p "Open repository in browser? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "https://github.com/jwilleke/mjs-inventory"
    fi
elif command -v xdg-open &> /dev/null; then
    read -p "Open repository in browser? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        xdg-open "https://github.com/jwilleke/mjs-inventory"
    fi
fi
