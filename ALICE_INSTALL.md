# Alice — Install & Clone (Start Here)

Welcome! This is the very first file you need to read.

It walks you through getting two apps installed on your Mac, downloading the Anvo repo, and kicking off the rest of the setup with Claude. You don't need to know anything about GitHub or coding — just follow the steps in order.

**Total time:** about 30 minutes, mostly downloads and Claude doing things while you watch.

> 📝 **Note for Alice specifically:** Edward sent you a personal setup brief that wraps this guide with credentials handoff steps and the exact Cowork prompt to use. Follow that brief first. This file (`ALICE_INSTALL.md`) is referenced from inside it — you'll come here when the brief tells you to.

## What you should already have

Before you start, make sure all of these are true:

- You have a GitHub account (you signed up at github.com and you have a username)
- You got an email saying you've been added to the `anvo-brain` repository, and you clicked **Accept invitation**
- You have your Mac in front of you
- You have Edward on Signal in case anything goes sideways

If any of those aren't true, Signal Edward before continuing.

## What's about to happen

You'll do four things:

1. Install **GitHub Desktop** — an app for downloading repositories from GitHub to your Mac
2. Sign into GitHub Desktop with your GitHub account
3. **Clone** the `anvo-brain` repository (download it to your Mac)
4. Install **Claude Desktop** if you don't already have it

When all four are done, you'll open one more file inside the cloned folder and Claude takes it from there.

---

## Step 1 — Install GitHub Desktop

1. Open **Safari** (or whatever browser you use).
2. Go to **https://desktop.github.com**
3. Click the big purple **Download for macOS** button.
4. Open your **Downloads** folder (find it in Finder, or click the Downloads icon in your Dock).
5. Find **GitHub Desktop.zip** and double-click it. macOS will unzip it into **GitHub Desktop.app**.
6. Drag **GitHub Desktop** into your **Applications** folder.
7. Open **GitHub Desktop** from Applications (or Spotlight: ⌘+Space, type "GitHub Desktop", press Enter).
8. macOS may ask: *"GitHub Desktop is an app downloaded from the Internet. Are you sure you want to open it?"* — click **Open**.

✅ Step 1 is done when GitHub Desktop is open and you see a welcome screen that says something like "Welcome to GitHub Desktop."

## Step 2 — Sign into GitHub Desktop

1. On the welcome screen, click **Sign in to GitHub.com**.
2. Your browser will open. GitHub will ask if you want to authorize GitHub Desktop. Click **Authorize desktop**.
3. The browser will say *"Opening GitHub Desktop"* and bounce you back to the app.
4. GitHub Desktop will show a "Configure Git" screen. Don't change anything — the name and email it pre-fills are correct. Click **Continue**.
5. On the "Make GitHub Desktop yours" screen, click **Finish**.

✅ Step 2 is done when you see your GitHub username in the top-left of GitHub Desktop.

## Step 3 — Clone (download) the anvo-brain repo

This is the most important step. Read it carefully — there's one field you need to change.

1. In GitHub Desktop, click **File** in the top menu bar → **Clone repository...**
2. A dialog opens. At the top there are three tabs: **GitHub.com**, **GitHub Enterprise**, **URL**. Click **GitHub.com**.
3. You should see a list of repositories you have access to. Find **`Anvo-Insurance/anvo-brain`** and click it once.
   - 💡 If you don't see it, type `anvo-brain` in the **Filter your repositories** box.
   - 🚨 If it still doesn't appear, Signal Edward — he probably needs to re-send your invite.
4. **Look at the "Local path" field at the bottom of the dialog.** It will show something like:
   ```
   /Users/<your-name>/Documents/GitHub/anvo-brain
   ```
   **You need to change this.** Click into the field, delete what's there, and type:
   ```
   /Users/<your-name>/dev/anvo-brain
   ```
   Replace `<your-name>` with your actual Mac username. (Not sure what it is? Open a Terminal window and type `whoami` — that's your Mac username.) For example, if `whoami` returns `alicehsyeh`, you'd type:
   ```
   /Users/alicehsyeh/dev/anvo-brain
   ```
   This matters because all the rest of the Anvo setup expects the repo to be at `~/dev/anvo-brain`. If it lands somewhere else, things won't find it.
5. Click the **Clone** button.
6. Wait. The download takes 10–60 seconds.

✅ Step 3 is done when GitHub Desktop shows **`anvo-brain`** at the top-left and a "no local changes" message in the main pane.

## Step 4 — Install Claude Desktop

If you already have Claude Desktop installed and you've been using **Cowork mode**, skip ahead to "You're done."

If not:

1. Go to **https://claude.ai/download**
2. Download **Claude for Mac**.
3. Open the downloaded file. Drag **Claude** into your **Applications** folder.
4. Open **Claude** from Applications.
5. Sign in with your **Anvo Google account** (`alice@anvo-insurance.com`). Use this account, not a personal one.
6. Look for **Cowork mode** inside the app. If you don't see it, Signal Edward — he'll get it enabled for you.

✅ Step 4 is done when you can see Cowork mode inside Claude Desktop.

---

## Step 5 — Let Claude finish the setup

The repo is now on your Mac at `/Users/<your-name>/dev/anvo-brain`. From here, Claude does the rest of the work — installing remaining tools, setting up your secrets folder, and walking you through a Google login.

> 📝 **Alice:** if you're following Edward's personal setup brief, go back to it now — Part 3 has the exact prompt for you to paste, plus the credentials-file context Claude needs. Skip the steps below.
>
> If you don't have a personal brief (e.g., you're a future hire who landed here directly), follow these steps:

### Step 5.1 — Make sure you have the credentials file

You need a file called exactly `anvo-oauth-credentials.json` in your **Downloads** folder. The administrator who onboarded you will have sent this to you separately.

If you don't have it, stop here and message the administrator — don't continue without it.

### Step 5.2 — Open Claude Desktop

1. Open **Claude Desktop** from Applications.
2. Switch into **Cowork mode**.
3. Select the cloned `anvo-brain` folder (`~/dev/anvo-brain`) as your working directory.

### Step 5.3 — Paste this prompt and press Enter

```
Read SETUP_MAC.md in this repo and walk me through setting up anvo-brain on my Mac. I have the `anvo-oauth-credentials.json` file from the admin in my Downloads folder. Run the setup as described in the runbook — handle the technical parts yourself, ask me to confirm before anything irreversible, and pause at the OAuth login step so I can complete it.
```

### Step 5.4 — Watch Claude work

Claude will:

- Check what's already installed and skip what you don't need
- Ask you to install missing tools (Homebrew, git) — copy/paste the commands it gives you into Terminal
- Move the credentials file from Downloads into a hidden secrets folder (`~/.anvo-secrets/`)
- Pause and walk you through a Google login (a browser window will pop open)
- Run a verification at the end and confirm everything works

🚨 **Important:** if Claude ever asks you to paste the **contents** of `anvo-oauth-credentials.json` into the chat, don't. Tell it to use the file directly from Downloads. Then message the administrator. Claude moving the file is fine; Claude reading the contents into chat is not.

✅ Setup is complete when Claude tells you it's verified all three Google services (Sheets, Drive, Gmail). At that point, you're ready to do real work in Cowork.

---

## If anything goes wrong

Don't try to push through. Message the person who onboarded you with:

- A **screenshot** of what's on your screen
- One sentence about which step you were on (e.g., "Step 3, the Clone button isn't doing anything")

Setup problems are easy to fix in the moment. They're harder to untangle later.

Common things that aren't really "wrong":

- 🟡 **macOS warning that an app "is from an unidentified developer"** — this happens with Claude Desktop sometimes. Right-click the app, choose **Open**, then click **Open** in the dialog.
- 🟡 **GitHub Desktop asks for permission to use your Keychain** — say yes. It's storing your GitHub login securely.
- 🟡 **You see a `.git` folder in the cloned repo** — that's normal. Don't touch it.
