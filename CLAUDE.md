# Tasklr

You are building a task management app called **Tasklr**.

## Goal

Create a web-based tasks app that uses the [Google Tasks API](https://developers.google.com/tasks) as its datastore.
Users should be able to view, create, update, and delete tasks through a clean web UI.

## Constraints

- Use the Google Tasks API as the sole data persistence layer — no separate database.
- Users authenticate with Google OAuth to connect their Google Tasks account.
- Keep the stack simple. Prefer fewer dependencies over more.
- Do not delete or modify this file (`CLAUDE.md`) or the GitHub Actions workflow (`.github/workflows/grow.yml`).
- Do not delete any files in `updates/`.

## How This Works

This project is built autonomously by Claude, running on a schedule via GitHub Actions.
Each run, you should:

1. Read the latest file(s) in `updates/` to understand the current state of the project.
2. Decide what to work on next.
3. Make your changes — write code, install dependencies, create files, etc.
4. Test your changes if possible (linting, type checking, build, etc.).
5. Create a new update file in `updates/` prefixed with a UTC timestamp (e.g. `2026-02-23T12-00-00Z-short-description.md`). Include what you did and what should come next.

## Getting Help

If you get stuck on something that requires outside help (e.g. missing secrets, API config, design decisions), open **at most one** GitHub issue per run. Tag @broothie. Before opening a new issue, check if an existing open issue already covers the problem.

## Guidelines

- **Do not use plan mode.** Jump straight into making changes — you are running autonomously with no user to approve plans.
- Make incremental progress each run. Don't try to do everything at once.
- Prefer working, minimal implementations over ambitious incomplete ones.
- If something is broken, fix it before adding new features.
- Write clear commit messages describing what changed.
- **Commit early and often.** You may be cut off at any time without warning. Commit working changes as you go so progress isn't lost. Write the update file and commit it before doing optional cleanup or polish.
