# Setup Guide — Windows

This is the Windows reference for the same setup `SETUP_MAC.md` covers. Primary user: Edward. Secondary: any future Windows teammate.

**Time:** ~20 minutes from a fresh machine.

---

## What You'll End Up With

```
C:\Users\<you>\dev\anvo-brain\         <- the repo (cloned from GitHub)
C:\Users\<you>\.anvo-secrets\          <- your private credentials (NOT in the repo)
   anvo-oauth-credentials.json
   anvo-oauth-token.json
   anvo-service-account.json

Environment variable set:
   ANVO_SECRETS_DIR=C:\Users\<you>\.anvo-secrets
```

---

## Step 1 — Install Prerequisites

Open **PowerShell** (Win+X → "Windows PowerShell" or "Terminal").

### 1a. Install Git

Download from https://git-scm.com/download/win and run the installer. Accept defaults.

Verify:

```powershell
git --version
```

### 1b. Install uv (Python package manager — needed for the MCP server)

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Restart PowerShell, then verify:

```powershell
uv --version
uvx --version
```

If `uvx` is not found, the install didn't finish wiring up PATH. Reboot, then retry.

---

## Step 2 — Clone the Repo

```powershell
mkdir -Force $HOME\dev | Out-Null
cd $HOME\dev
git clone https://github.com/Anvo-Insurance/anvo-brain.git
cd anvo-brain
ls
```

You should see folders like `carriers/`, `commissions/`, `intake/`, `outreach/`, `business/`, `marketing/`, plus `README.md` and `CLAUDE.md`.

---

## Step 3 — Set Up the Secrets Folder

The repo's `.mcp.json` references `${ANVO_SECRETS_DIR}\anvo-oauth-credentials.json` and `${ANVO_SECRETS_DIR}\anvo-oauth-token.json`. Create the folder and drop the credential files in.

### 3a. Create the folder

```powershell
mkdir -Force $HOME\.anvo-secrets | Out-Null
```

### 3b. Place the credential files

Three files belong here:

- `anvo-oauth-credentials.json`
- `anvo-oauth-token.json`
- `anvo-service-account.json`

Save them directly into `C:\Users\<you>\.anvo-secrets\`. **Never commit these into the repo.**

### 3c. Verify

```powershell
ls $HOME\.anvo-secrets
```

You should see all three `.json` files.

---

## Step 4 — Set the ANVO_SECRETS_DIR Environment Variable

This tells the repo's `.mcp.json` where to find credentials. The variable needs to persist across PowerShell sessions and reboots, so use `setx` (which writes to the registry).

### 4a. Set it

```powershell
setx ANVO_SECRETS_DIR "$HOME\.anvo-secrets"
```

You'll see `SUCCESS: Specified value was saved.`

### 4b. Open a new PowerShell window

`setx` only takes effect in **new** shells, not the current one.

### 4c. Verify

In the new PowerShell window:

```powershell
echo $env:ANVO_SECRETS_DIR
```

Expected: `C:\Users\<you>\.anvo-secrets`

---

## Step 5 — Test the MCP Connection

### 5a. From the repo root

```powershell
cd $HOME\dev\anvo-brain
uvx mcp-google-sheets@latest --help
```

First run downloads the MCP server (~30 seconds). Subsequent runs are instant.

### 5b. Test in Claude Code

```powershell
cd $HOME\dev\anvo-brain
claude
```

In the Claude session, ask:

> "List the spreadsheets I have access to."

If it returns a list, you're good. If you see an authentication error, check:

1. `echo $env:ANVO_SECRETS_DIR` — is the variable set in this shell?
2. `ls $env:ANVO_SECRETS_DIR` — are all three `.json` files there?
3. The repo's `.mcp.json` — does it reference `${ANVO_SECRETS_DIR}` (not a hardcoded path)?

---

## Step 6 — Read the Operating Manual

Before starting any real work, read:

- `README.md` — what the repo is, who uses it, navigation
- `CLAUDE.md` — sync protocol (when to `git pull`, `git push`, how to avoid conflicts), git auth notes, working conventions

Pay close attention to the **Multi-Session Sync Protocol** section in `CLAUDE.md` if you'll be running Cowork sessions in parallel with Alice.

---

## Common Errors

### `uvx` says "command not found"

`uv` isn't on PATH yet. Close and reopen PowerShell. If still missing, reboot.

### Git clone fails with HTTPS authentication prompt

GitHub no longer accepts password-based HTTPS. Use a Personal Access Token, or switch the remote to SSH if you've configured a key. PAT setup: GitHub → Settings → Developer settings → Personal access tokens → Generate new token (classic), `repo` scope, paste when prompted.

### MCP server says "credentials not found"

Either `ANVO_SECRETS_DIR` isn't set in this shell (close/reopen, or run `setx` again and reopen), or the JSON files aren't in `%USERPROFILE%\.anvo-secrets\`.

### OneDrive interferes with the repo

Do NOT clone the repo into a OneDrive-synced folder. OneDrive's read-only attribute handling and sync conflicts will corrupt `.git/index`. Use `C:\Users\<you>\dev\anvo-brain` (outside OneDrive) — that's why Step 2 puts it in `$HOME\dev\`.

### `.git\index.lock` errors during git operations

Usually means a previous git command crashed. Delete the lock file manually:

```powershell
del .git\index.lock
```

Then retry. If the index itself is corrupted (rare, OneDrive-related), `del .git\index; git reset` will rebuild it from HEAD.

---

## Done

Day-to-day:

```powershell
cd $HOME\dev\anvo-brain
git pull
# ... do work ...
git add -A
git commit -m "What you changed"
git push
```

For per-workflow operations (intake, commissions, outreach), refer to the relevant folder's `README.md` or `workflow.md`.
