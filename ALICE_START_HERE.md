# Alice — Start Here

> 🚨 **Don't have the repo cloned yet?** If you haven't installed GitHub Desktop, cloned `anvo-brain`, and installed Claude Desktop yet, **open `ALICE_INSTALL.md` first.** That file walks you through the install + clone (about 20 minutes). Come back to this file when you're done.

This file is the second half of setup. Everything from here is automated by Claude.

## What's about to happen

You're going to set up the anvo-brain repo on your Mac. Claude will drive the entire setup for you — installing tools, configuring credentials, and verifying everything works. Your job is just to confirm steps, paste a single credential file when asked, and complete one Google login.

Total time: ~15-20 minutes, mostly waiting.

## Before you start

Make sure you have:

1. The Mac you want to set up.
2. **One file from Edward**, sent to you over Signal: `anvo-oauth-credentials.json`. Save it to your Downloads folder. Don't open it, don't forward it.
3. The login info for your Anvo Google account (`alice@anvo-insurance.com` or whatever Edward set up).

## What to do

1. Open **Claude Desktop** on your Mac.
2. Switch into **Cowork mode** and select the cloned `anvo-brain` folder as your working directory.
3. Paste this exact prompt and press Enter:

> Read SETUP_MAC.md in this repo and walk me through setting up anvo-brain on my Mac. I'm Alice. I have the `anvo-oauth-credentials.json` file from Edward in my Downloads folder. Run the setup as described in the runbook — handle the technical parts yourself, ask me to confirm before anything irreversible, and pause at the OAuth login step so I can complete it.

That's it. Claude will take it from there.

## What to expect

Claude will:

- Check what's already installed and skip anything you don't need
- Install missing tools (Homebrew, git, uv) and ask before each one
- Set up your secrets folder and move the credentials file into it
- Pause and walk you through the Google login step (a browser window will pop up)
- Run a verification at the end and tell you what works and what doesn't

If Claude gets stuck or you're not sure about something it's asking, stop and Signal Edward with what's on screen. Setup problems are easy to fix when they happen; harder to untangle later.

## When setup is done

Claude will tell you. After that, day-to-day, you'll work in Cowork the same way you have been — except now the agent can read all of Anvo's operating instructions from the repo (commissions workflow, intake checklists, carrier matrix, etc.) and act on them.
