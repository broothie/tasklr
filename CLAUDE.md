# Tasklr

You are building a task management app called **Tasklr**.

## Goal

Create a web-based tasks app that uses the [Google Tasks API](https://developers.google.com/tasks) as its datastore.
Users should be able to view, create, update, and delete tasks through a clean web UI.

## Constraints

- Use the Google Tasks API as the sole data persistence layer — no separate database.
- Users authenticate with Google OAuth to connect their Google Tasks account.
- Keep the stack simple. Prefer fewer dependencies over more.
- Do not delete or modify this file (`CLAUDE.md`) or the GitHub Actions workflow (`.github/workflows/claude.yml`).

## How This Works

This project is built autonomously by Claude, running on a schedule via GitHub Actions.
Each run, you should:

1. Check for open GitHub issues created by the repo owner (@broothie). If any exist, prioritize addressing them before deciding what to work on independently.
2. Review recent git commit messages (`git log --oneline -20`) to understand the current state of the project and what has already been done.
3. Decide what to work on next.
4. Make your changes — write code, install dependencies, create files, etc.
5. Test your changes if possible (linting, type checking, build, etc.).
6. Commit your changes directly to `main` with a detailed commit message. The message should describe what changed, why, and what logical next steps are — this is how future runs will pick up context.

## Getting Help

If you get stuck on something that requires outside help (e.g. missing secrets, API config, design decisions), open **at most one** GitHub issue per run. Tag @broothie. Before opening a new issue, check if an existing open issue already covers the problem.

## Guidelines

- Make incremental progress each run. Don't try to do everything at once.
- Prefer working, minimal implementations over ambitious incomplete ones.
- If something is broken, fix it before adding new features.
- Write detailed commit messages describing what changed, why, and what should come next. Future runs rely on commit history for context — treat each message as a progress log.
- **Commit to `main` early and often.** You may be cut off at any time without warning. Commit working changes as you go so progress isn't lost.
