# Contributing to Facebook Comment Moderation Bot

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project is designed for educational purposes. We expect all contributors to:

- Be respectful and constructive
- Focus on educational value
- Help others learn
- Provide clear documentation
- Write beginner-friendly code

## Getting Started

1. **Fork the repository**
   ```bash
   # Click 'Fork' button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/facebook-moderation-bot.git
   cd facebook-moderation-bot
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Sudan23/facebook-moderation-bot.git
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites

- Node.js 18+
- MongoDB 6+
- Docker (optional)
- Git

### Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Set Up Environment

```bash
# Copy example environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit with your values
```

### Start Development Servers

```bash
# Terminal 1: Start MongoDB
docker run -d -p 27017:27017 mongo:6

# Terminal 2: Start backend
cd backend
npm run dev

# Terminal 3: Start frontend
cd frontend
npm start
```

## How to Contribute

### Types of Contributions

1. **Bug Fixes**: Fix existing issues
2. **New Features**: Add new functionality
3. **Documentation**: Improve docs and comments
4. **Tests**: Add test coverage
5. **Performance**: Optimize code
6. **UI/UX**: Enhance user interface

### Finding Issues

- Look for issues tagged with `good first issue`
- Check `help wanted` labels
- Review open issues and discussions

## Coding Standards

### JavaScript/React

- Use ES6+ features
- Follow functional programming when possible
- Use meaningful variable names
- Add JSDoc comments for functions
- Use async/await instead of callbacks

**Example:**

```javascript
/**
 * Fetches comments from the database
 * @param {string} status - Comment status filter
 * @param {number} page - Page number
 * @returns {Promise<Array>} Array of comments
 */
async function getComments(status, page) {
  // Implementation
}
```

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Use them
- **Line length**: Max 100 characters
- **Naming**:
  - camelCase for variables and functions
  - PascalCase for React components
  - UPPER_CASE for constants

### Comments

- Explain **why**, not **what**
- Keep comments up to date
- Use educational comments for complex logic
- Add TODO comments for future improvements

**Good:**
```javascript
// Calculate average to determine overall toxicity
const avgScore = totalScore / categoryCount;
```

**Bad:**
```javascript
// Divide totalScore by categoryCount
const avgScore = totalScore / categoryCount;
```

### React Best Practices

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use PropTypes or TypeScript for type checking
- Implement proper error boundaries

### Backend Best Practices

- Use try-catch for async operations
- Return consistent response formats
- Validate all inputs
- Use proper HTTP status codes
- Log errors appropriately

## Testing Guidelines

### Writing Tests

**Backend Tests:**
```javascript
describe('Comment Service', () => {
  it('should analyze comment toxicity', async () => {
    const result = await analyzeComment('test comment');
    expect(result).toHaveProperty('toxicityScore');
  });
});
```

**Frontend Tests:**
```javascript
test('renders login button', () => {
  render(<Login />);
  const button = screen.getByText(/Login with Facebook/i);
  expect(button).toBeInTheDocument();
});
```

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Test coverage
npm test -- --coverage
```

### Manual Testing

Before submitting PR:

1. Test all modified functionality
2. Check for console errors
3. Verify API responses
4. Test on different browsers
5. Test responsive design
6. Verify Docker build

## Pull Request Process

### Before Submitting

1. **Update from upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Build successfully**
   ```bash
   npm run build
   ```

4. **Update documentation**
   - Update README if needed
   - Add JSDoc comments
   - Update TESTING.md if applicable

### Creating Pull Request

1. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create PR on GitHub**
   - Go to original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested locally
- [ ] Added tests
- [ ] All tests pass
- [ ] No console errors

## Screenshots (if UI changes)
Add screenshots here

## Additional Notes
Any additional information
```

### Commit Message Format

Use conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(backend): add comment filtering by date
fix(frontend): correct pagination bug on comments page
docs(readme): update installation instructions
```

## Reporting Bugs

### Before Reporting

1. Check existing issues
2. Verify it's reproducible
3. Test on latest version
4. Gather error messages and logs

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Windows 10]
- Node.js version: [e.g., 18.2.0]
- Browser: [e.g., Chrome 96]

**Additional Context**
Any other relevant information
```

## Suggesting Features

### Feature Request Template

```markdown
**Problem**
What problem does this solve?

**Proposed Solution**
Describe your solution

**Alternatives**
Other solutions considered

**Additional Context**
Mockups, examples, etc.
```

## Code Review Process

1. **Automated Checks**: PR must pass CI/CD
2. **Code Review**: Maintainer reviews code
3. **Feedback**: Address review comments
4. **Approval**: Get approval from maintainer
5. **Merge**: Maintainer merges PR

### Review Criteria

- Code quality and style
- Test coverage
- Documentation
- Performance impact
- Security considerations
- Educational value

## Additional Resources

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Documentation](https://react.dev/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [TensorFlow.js Guide](https://www.tensorflow.org/js)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)

## Questions?

- Open a discussion on GitHub
- Comment on existing issues
- Review the documentation

## Recognition

Contributors will be:
- Listed in README
- Mentioned in release notes
- Credited in commits

Thank you for contributing! 🎉
