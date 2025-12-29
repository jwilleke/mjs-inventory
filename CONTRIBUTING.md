# Contributing to MJS Inventory

First off, thank you for considering contributing to the Home Inventory Management System! It's people like you that make this tool better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain which behavior you expected to see instead**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the TypeScript/JavaScript style guide
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Development Process

1. **Fork the repository**
   ```bash
   # Click 'Fork' on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/mjs-inventory.git
   cd mjs-inventory
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/my-new-feature
   # or
   git checkout -b fix/my-bug-fix
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Make your changes**
   - Write clear, commented code
   - Follow existing code style
   - Add tests if applicable
   - Update documentation as needed

6. **Build and test**
   ```bash
   npm run build
   npm run lint
   # Test your changes thoroughly
   ```

7. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: Add amazing new feature"
   ```

   **Commit message format:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

8. **Push to your fork**
   ```bash
   git push origin feature/my-new-feature
   ```

9. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template
   - Submit!

## Style Guide

### TypeScript/JavaScript

* Use TypeScript for all new code
* Follow the existing code style
* Use meaningful variable and function names
* Add JSDoc comments for functions
* Keep functions small and focused
* Use async/await over promises when possible

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### Documentation

* Use Markdown for documentation
* Keep line length to 80-100 characters where possible
* Include code examples where helpful
* Update README.md if you change functionality

## Project Structure

```
mjs-inventory/
├── src/                    # TypeScript source code
│   ├── types/             # Type definitions
│   ├── services/          # Business logic
│   ├── routes/            # API routes
│   └── server.ts          # Main server
├── public/                # Frontend files
├── data/                  # Data storage (gitignored)
├── tests/                 # Test files (if added)
└── docs/                  # Documentation
```

## Testing

While we don't currently have automated tests, please manually test:

* Creating, reading, updating, and deleting items
* Search and filter functionality
* Import/export features
* Statistics calculations
* Edge cases (empty data, large datasets, etc.)

## Additional Notes

### Issue and Pull Request Labels

* `bug` - Something isn't working
* `enhancement` - New feature or request
* `documentation` - Documentation improvements
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention needed
* `question` - Further information requested
* `wontfix` - This will not be worked on

## Recognition

Contributors will be recognized in the README.md file.

## Questions?

Feel free to open an issue with the `question` label or contact the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to MJS Inventory! 🎉
