# 🤝 Contributing Guidelines

We welcome contributions to FitSage AI! Please follow these guidelines to keep the codebase clean, secure, and maintainable.

---

## 1. Development Principles
- **No Direct Master/Main Commits**: All changes must be developed on feature branches and submitted via Pull Requests.
- **Maintain Modular Architecture**: Keep routes thin; delegate all AI prompts, logic, validations, safety checks, and database caching triggers to the service layer.
- **Backward Compatibility**: Ensure that updates to the database schema or AI generation JSON outputs do not break existing frontend rendering paths.

---

## 2. Commit Message Standards
We follow the **Conventional Commits** standard:

- `feat:` introducing new features.
- `fix:` fixing bugs or logic issues.
- `docs:` modifying document files (`README.md`, etc.).
- `style:` changes that do not affect code logic (formatting, spacing, CSS cleanup).
- `refactor:` rewriting code to optimize performance or clean up structure.
- `test:` adding or updating tests.
- `chore:` updating dependencies, build tools, or license config items.

*Example*: `feat: add joint-injury filters to workout orchestrator`

---

## 3. Pull Request Guidelines
1. **Branch Naming**: Use a prefix indicating the change type followed by a short description:
   - `feature/jwt-refresh`
   - `bugfix/query-pooling`
   - `docs/api-specs`
2. **Local Validation**: Before opening a PR, ensure:
   - The React frontend compiles successfully (`npm run build`).
   - The test script suites pass without errors.
3. **Review Lifecycle**: Every PR requires a review from at least one core developer before merging.
