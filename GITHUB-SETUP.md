# GitHub Setup Instructions

Follow these steps to push this project to your GitHub repository at https://github.com/jwilleke/mjs-inventory

## Option 1: Push from Your Local Machine

### Prerequisites
- Git installed on your machine
- GitHub account with access to the repository
- SSH key or personal access token configured

### Steps

1. **Download and extract the project** to your local machine

2. **Navigate to the project directory**
   ```bash
   cd home-inventory-app
   ```

3. **Initialize git (if not already done)**
   ```bash
   git init
   ```

4. **Add all files to git**
   ```bash
   git add .
   ```

5. **Commit the files**
   ```bash
   git commit -m "Initial commit: Home inventory management system"
   ```

6. **Rename branch to main (if needed)**
   ```bash
   git branch -M main
   ```

7. **Add your GitHub repository as remote**
   ```bash
   git remote add origin https://github.com/jwilleke/mjs-inventory.git
   ```

8. **Push to GitHub**
   ```bash
   git push -u origin main
   ```

## Option 2: Using GitHub CLI

If you have GitHub CLI installed:

```bash
cd home-inventory-app
git add .
git commit -m "Initial commit: Home inventory management system"
gh repo create jwilleke/mjs-inventory --public --source=. --remote=origin --push
```

## Option 3: Using GitHub Desktop

1. Open GitHub Desktop
2. File → Add Local Repository
3. Choose the `home-inventory-app` folder
4. Click "Publish repository"
5. Enter repository name: `mjs-inventory`
6. Choose public or private
7. Click "Publish Repository"

## If Repository Already Exists

If the repository already exists on GitHub, you may need to force push (be careful, this will overwrite existing content):

```bash
git remote add origin https://github.com/jwilleke/mjs-inventory.git
git branch -M main
git push -u origin main --force
```

Or merge with existing content:

```bash
git remote add origin https://github.com/jwilleke/mjs-inventory.git
git branch -M main
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## Authentication

### Using HTTPS with Personal Access Token

When prompted for password, use a Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo` (full control)
4. Copy the token
5. Use it as password when pushing

### Using SSH

Configure SSH key:

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

Add the public key to GitHub:
1. GitHub → Settings → SSH and GPG keys → New SSH key
2. Paste your public key

Then use SSH URL:
```bash
git remote set-url origin git@github.com:jwilleke/mjs-inventory.git
git push -u origin main
```

## Verify

After pushing, visit: https://github.com/jwilleke/mjs-inventory

You should see all your files including:
- README.md
- src/ directory with TypeScript code
- public/ directory with frontend
- API.md documentation
- Example files

## Next Steps

1. **Add repository description** on GitHub
2. **Add topics/tags**: `inventory`, `typescript`, `nodejs`, `schema-org`
3. **Enable GitHub Pages** if you want to host the docs
4. **Configure branch protection** rules if needed
5. **Add collaborators** if working in a team

## Updating the Repository

After making changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

## Troubleshooting

### Permission denied
- Check your authentication (SSH key or personal access token)
- Verify you have write access to the repository

### Repository not found
- Verify the repository URL
- Check repository permissions
- Ensure repository exists on GitHub

### Merge conflicts
- Pull latest changes: `git pull origin main`
- Resolve conflicts manually
- Commit and push

## Need Help?

- [GitHub Docs](https://docs.github.com/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub CLI](https://cli.github.com/)
