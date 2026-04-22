# SETUP_MAC.md — Brief for First-Time anvo-brain Setup on macOS

**Primary reader:** Claude (Cowork agent on the user's Mac).
**Secondary reader:** the human user, narrated to in real time by Claude.

This is a brief, not a script. It gives you the goal, the constraints, the verification checkpoints, and the context you need. Sequence the actual commands yourself, adapted to what's already installed and what isn't.

---

## Who You're Helping

Most likely Alice — Anvo Insurance operations lead, ~10 years in insurance, non-technical. She's confident with software but doesn't read shell output, doesn't parse error messages, and doesn't want to. Translate everything for her in plain English and confirm before anything irreversible.

If it's not Alice, ask their name and adjust.

## What She Has on Day One

- A Mac (assume modern macOS, possibly fresh).
- The repo cloned at `~/dev/anvo-brain` (Edward confirmed).
- `anvo-oauth-credentials.json` from Edward, sent over Signal, saved somewhere on her machine (probably `~/Downloads`).
- Login credentials for her Anvo Google account (`alice@anvo-insurance.com` or similar).
- Claude Desktop installed, Cowork mode active in the `~/dev/anvo-brain` folder.

## End State ("Done" Looks Like)

```
~/.anvo-secrets/
   ├─ anvo-oauth-credentials.json    (provided by Edward, moved here from Downloads)
   └─ anvo-oauth-token.json          (generated automatically during OAuth flow)

~/.zshrc contains: export ANVO_SECRETS_DIR="$HOME/.anvo-secrets"

Verification: in a fresh Terminal, all three of these succeed via the MCP server —
  - A Sheets read (e.g., list spreadsheets)
  - A Drive read (e.g., list ISM Remittances folder)
  - A Gmail read (e.g., list "MGA Commissions" label threads, last 5)
```

If those three reads work, setup is complete.

## Capability Boundary (Important)

You're running in Cowork's sandbox. You can read/write files in mounted folders, but you cannot execute commands against Alice's actual macOS shell. In particular:

- **You cannot install software on her Mac** (Homebrew, git, uv) — your sandbox's brew is not her brew. She must run installers in her Terminal.
- **You cannot trigger the OAuth browser flow** — that has to happen in her browser, initiated from her actual shell.
- **Your `$ANVO_SECRETS_DIR` is not her `$ANVO_SECRETS_DIR`** — checking env vars in your sandbox tells you nothing about her shell. Read `~/.zshrc` to verify the export is there.

What you CAN do directly in mounted paths: create `~/.anvo-secrets/`, move the credentials file into it, append the export to `~/.zshrc`, read state of any file.

The cleanest pattern: ask Alice to run the install/OAuth commands in her Terminal and paste the output back to you. You read the output and decide what's next.

## Phases (Goals, Not Scripts)

### Phase 1 — Orient

Find out what's already done. Don't assume. Read filesystem state, check `~/.zshrc` for the env var, ask Alice to confirm anything you can't observe (e.g., "Have you ever installed Homebrew on this Mac before?"). Then tell her in plain English what's done and what's left.

**Verification before moving on:** you have a confident picture of which of these are already in place: Homebrew, git, uv, `~/.anvo-secrets/` folder, credentials file location, `ANVO_SECRETS_DIR` in `~/.zshrc`.

### Phase 2 — Prerequisites

Goal: Homebrew, git, and uv all return version numbers when Alice runs `--version` in her Terminal.

What you do: tell Alice what's missing, give her the install commands one at a time, wait for output, verify. The Homebrew installer takes 5-10 minutes and prints PATH-setup commands at the end — make sure she runs those too and reopens Terminal before checking the version.

**Verification:** she pastes back `brew --version`, `git --version`, `uv --version` outputs that all show real version numbers.

### Phase 3 — Secrets folder + credentials file

Goal: `~/.anvo-secrets/` exists with permissions `700`, contains `anvo-oauth-credentials.json` and nothing else.

You can do this directly via mounted file ops if her home directory is mounted. If it isn't, ask her to do it in Terminal. Either way, confirm the file is in place and ask her where she got it from — if she says "I opened it to peek at it" or "I emailed it to myself," flag that as a security concern and tell her to re-Signal Edward for a fresh copy. The credentials file should never have been opened, forwarded, or duplicated.

**Verification:** `ls -la ~/.anvo-secrets/` shows `drwx------` perms on the folder and one `.json` file inside.

### Phase 4 — Environment variable

Goal: `ANVO_SECRETS_DIR` is set in `~/.zshrc` to `$HOME/.anvo-secrets` and persists to new Terminal sessions.

Append the export line to `~/.zshrc`. Then ask Alice to open a fresh Terminal and run `echo $ANVO_SECRETS_DIR` — the output should be the literal path (`/Users/alice/.anvo-secrets`), not the string `$HOME`.

**Verification:** her fresh-shell `echo` returns the resolved path.

### Phase 5 — OAuth login (human-in-the-loop)

Goal: `~/.anvo-secrets/anvo-oauth-token.json` exists, generated by Alice completing the Google OAuth flow with her Anvo account.

What happens: Alice runs `claude` in `~/dev/anvo-brain`, prompts something Sheets-related ("List the spreadsheets I have access to"), and the MCP server detects no token and pops open a browser. She logs in with her Anvo Google account (NOT personal), approves the scopes, gets through the "Google hasn't verified this app" warning (Advanced → Go to (app) (unsafe) — reassure her this is normal for internal apps), and the token file gets written automatically.

You cannot do any of this for her. Brief her thoroughly before she starts, walk her through what each screen will look like, and stand by to interpret any errors.

**Verification:** `ls ~/.anvo-secrets/` now shows two `.json` files. Sheets call returned a list (not an error).

### Phase 6 — End-to-end verification

Goal: confirm reads work across all three Google services the MCP needs.

Have Alice (still in her `claude` session) prompt three reads — one Sheets, one Drive, one Gmail. Examples in the End State section above. If all three return real data, setup is complete. If any fail, capture the error verbatim and surface to Edward — don't try to fix it yourself.

### Phase 7 — Handoff

Tell Alice she's done. Suggest she skim `README.md` and `CLAUDE.md` (especially the Multi-Session Sync Protocol) before starting real work. Offer to open them for her.

## Guardrails (Never Cross These)

- **Do not write to or modify the credentials JSON files** under any circumstance. They're treated as opaque tokens.
- **Do not commit or push to the repo during setup.** No setup action should produce a git commit.
- **Do not take any write action against Anvo's Google services** — no Sheet edits, no email sends, no Drive uploads, no Calendar changes. Reads only, and only as part of verification.
- **Do not modify files outside `~/dev/anvo-brain`, `~/.anvo-secrets/`, and `~/.zshrc`.**
- **Do not guess on errors.** If an error message is ambiguous, surface it to Alice in plain English and offer to send Edward the exact text via her Signal.
- **Do not skip the OAuth browser warnings explanation.** Non-technical users often abandon setup at the "Google hasn't verified this app" screen because it looks dangerous. Reassure proactively.

## When to Stop and Escalate

- Alice has done something with the credentials file you can't undo (opened, forwarded, duplicated to multiple locations).
- The OAuth flow fails twice in a row.
- A verification read returns auth errors after the token file appears (suggests Anvo Google account permissions issue — Edward needs to fix).
- Alice asks a question about Anvo operations or the repo's content that goes beyond setup ("Should I try the commissions workflow?"). Setup is done; redirect her to read `README.md` and start a fresh Cowork session for actual work.
- Anything ambiguous. Stop, surface, ask. The cost of asking is 30 seconds; the cost of guessing wrong on a credential or env-var setup is hours of debugging later.

## Notes for Future Maintainers

- This brief assumes Cowork mode with mounted access to the user's home directory (or at least `~/dev/anvo-brain`, `~/.anvo-secrets`, and `~/.zshrc`). If those aren't mounted, every direct file action becomes a "tell the user to run this in Terminal" — still works, just more copy-paste.
- The OAuth flow is currently triggered by the first MCP Sheets call from Claude Code. If `mcp-google-sheets` adds an explicit `--auth` command in the future, prefer that path.
- For Personal Access Token (PAT) handling on `git clone`: not addressed here because the repo is assumed already cloned. If a future user lands here without the repo, escalate the PAT step to Edward — don't embed PAT generation, since PATs are per-user and rotate.
