# Setup Guide — macOS

This guide gets you from "fresh Mac" to "working anvo-brain repo with commissions tracker running." Follow steps in order. Each step has a verification command so you know it worked before moving on.

**Audience:** Alice (or anyone setting up the repo on a Mac for the first time).
**Time:** ~20 minutes.

---

## What You'll End Up With

```
~/dev/anvo-brain/              ← the repo (cloned from GitHub)
~/.anvo-secrets/                ← your private credentials (NOT in the repo)
   ├─ anvo-oauth-credentials.json
   ├─ anvo-oauth-token.json
   └─ anvo-service-account.json

Environment variable set:
   ANVO_SECRETS_DIR=/Users/<your-username>/.anvo-secrets
```

---

## Step 1 — Install Prerequisites

Open **Terminal** (Cmd+Space → type "Terminal" → Enter).

### 1a. Install Homebrew (if you don't already have it)

Check first:

```bash
brew --version
```

If you see a version number, skip to 1b. If you see "command not found":

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the on-screen prompts. After it finishes, the installer prints two commands you need to copy-paste to add Homebrew to your PATH. Run them. Then restart Terminal.

Verify:

```bash
brew --version
```

### 1b. Install Git

```bash
brew install git
git --version
```

### 1c. Install uv (Python package manager — needed for the MCP server)

```bash
brew install uv
uv --version
```

---

## Step 2 — Clone the Repo

```bash
mkdir -p ~/dev
cd ~/dev
git clone https://github.com/Anvo-Insurance/anvo-brain.git
cd anvo-brain
ls
```

You should see folders like `carriers/`, `commissions/`, `intake/`, `outreach/`, plus files like `README.md` and `CLAUDE.md`.

If the clone fails with an authentication prompt: GitHub no longer accepts password-based HTTPS. You'll need a personal access token. Ask Edward.

---

## Step 3 — Set Up the Secrets Folder

The `.mcp.json` in the repo points at `${ANVO_SECRETS_DIR}/anvo-oauth-credentials.json` and `${ANVO_SECRETS_DIR}/anvo-oauth-token.json`. You need to create that folder and put the credential files in it.

### 3a. Create the folder

```bash
mkdir -p ~/.anvo-secrets
chmod 700 ~/.anvo-secrets   # only you can read it
```

### 3b. Get the credential files from Edward

Edward will send you three files via a secure channel (Signal, encrypted email — NOT plain Slack/iMessage):

- `anvo-oauth-credentials.json`
- `anvo-oauth-token.json`
- `anvo-service-account.json`

**Save them directly into `~/.anvo-secrets/`.** Do not put them in the repo or anywhere else.

### 3c. Verify

```bash
ls -la ~/.anvo-secrets/
```

You should see all three `.json` files. Permissions should look like `-rw-------` (only you can read).

---

## Step 4 — Set the ANVO_SECRETS_DIR Environment Variable

This tells the repo's `.mcp.json` where to find the credentials. The variable needs to persist across Terminal sessions.

### 4a. Add it to your shell config

macOS uses **zsh** by default. Add the variable to `~/.zshrc`:

```bash
echo 'export ANVO_SECRETS_DIR="$HOME/.anvo-secrets"' >> ~/.zshrc
```

### 4b. Reload your shell

```bash
source ~/.zshrc
```

### 4c. Verify

```bash
echo $ANVO_SECRETS_DIR
```

Expected output: `/Users/<your-username>/.anvo-secrets` (not the literal `$HOME` — if you see `$HOME`, something went wrong).

---

## Step 5 — Test the MCP Connection

The repo's `.mcp.json` configures a Google Sheets MCP server. Test that it can read your credentials and connect.

### 5a. From the repo root

```bash
cd ~/dev/anvo-brain
uvx mcp-google-sheets@latest --help
```

This downloads the MCP server and prints its help text. First run takes ~30 seconds (downloading dependencies). Subsequent runs are instant.

### 5b. Test in Claude Code

Open Claude Code in the repo:

```bash
cd ~/dev/anvo-brain
claude
```

In the Claude session, ask:

> "List the spreadsheets I have access to."

If credentials are working, you'll get a list. If you see an authentication error, check:

1. `echo $ANVO_SECRETS_DIR` — is the variable set?
2. `ls $ANVO_SECRETS_DIR/` — are the three `.json` files there?
3. The `.mcp.json` file in the repo — does it reference `${ANVO_SECRETS_DIR}` (not a hardcoded path)?

---

## Step 6 — Read the Operating Manual

Before starting any real work, read these two files in the repo:

- `README.md` — what the repo is, who uses it, navigation
- `CLAUDE.md` — sync protocol (when to `git pull`, `git push`, how to avoid conflicts), git auth setup, working conventions

Pay special attention to the **Multi-Session Sync Protocol** section in `CLAUDE.md`. When two people are editing the repo via Cowork sessions, you need to follow it to avoid conflicts.

---

## Common Errors

### "Permission denied" when running `git clone`

You're trying SSH but GitHub doesn't have your key. Use HTTPS instead (the URL above is already HTTPS).

### `uvx` says "command not found"

`uv` isn't on your PATH. Run `which uv` — if it returns nothing, the install didn't complete. Try: `brew reinstall uv`. If `which uv` returns a path but `uvx` doesn't work, try restarting Terminal.

### MCP server says "credentials not found"

Either `ANVO_SECRETS_DIR` isn't set, or the JSON files aren't in `~/.anvo-secrets/`. Re-run Step 3 and 4.

### Cowork session can't push (`unset GIT_SSH_COMMAND` error or similar)

See the **Git Auth From Cowork Sandbox** section in `CLAUDE.md` — it has the workaround for the sandbox's SSH key handling.

---

## Done

You're ready. Next time you start work:

```bash
cd ~/dev/anvo-brain
git pull
# ... do work ...
git add -A
git commit -m "What you changed"
git push
```

For day-to-day operations (intake, commissions, outreach), refer to the relevant folder's instructions.
