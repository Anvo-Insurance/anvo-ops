# Alice — Install & Clone (Start Here)

Welcome! This is the very first file you need to read.

It walks you through getting two apps installed on your Mac and downloading the Anvo repo. After this file, one more file (`ALICE_START_HERE.md`) finishes setup with Claude. Then you're ready to work.

You don't need to know anything about GitHub or coding. Just follow the steps in order.

**Total time:** about 20 minutes, mostly downloads.

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

## You're done with this file!

The repo is now on your Mac at `/Users/<your-name>/dev/anvo-brain`. The next file picks up from here.

### Open the next file

Two ways to find it:

**Option A — through GitHub Desktop:**

1. In GitHub Desktop, click **Repository** in the top menu → **Show in Finder**.
2. Finder opens to the cloned folder.
3. Find the file called **`ALICE_START_HERE.md`** and double-click it.

**Option B — through Finder directly:**

1. Open **Finder**.
2. Press **⌘+Shift+G** (Go → Go to Folder).
3. Type `~/dev/anvo-brain` and press Enter.
4. Find **`ALICE_START_HERE.md`** and double-click it.

The file will open in TextEdit or another markdown viewer. Read it top-to-bottom and follow the instructions inside.

---

## If anything goes wrong

Don't try to push through. Signal Edward with:

- A **screenshot** of what's on your screen
- One sentence about which step you were on (e.g., "Step 3, the Clone button isn't doing anything")

Setup problems are easy to fix in the moment. They're harder to untangle later.

Common things that aren't really "wrong":

- 🟡 **macOS warning that an app "is from an unidentified developer"** — this happens with Claude Desktop sometimes. Right-click the app, choose **Open**, then click **Open** in the dialog.
- 🟡 **GitHub Desktop asks for permission to use your Keychain** — say yes. It's storing your GitHub login securely.
- 🟡 **You see a `.git` folder in the cloned repo** — that's normal. Don't touch it.
