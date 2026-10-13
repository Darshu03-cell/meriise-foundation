# Task: Push → live auto-deploy for meriise.org (Hostinger hPanel GIT)

## BREAKTHROUGH (screenshot of hPanel GIT page)
public_html is **ALREADY a Git-connected deploy** in hPanel. Manage Repositories lists:
`github.com/ME-RIISE-FOUNDATION/meriise-foundation.git` · branch **main** · path **/**.
No empty-and-clone needed. The old plan (empty public_html) is CANCELLED.

## Confirmed facts
- `ME-RIISE-FOUNDATION/meriise-foundation` **301-redirects to** `Darshu03-cell/meriise-foundation`
  — SAME repo (transferred; GitHub keeps redirect; repo id 892552379).
- Local HEAD = origin/main = that repo's main = **ed69630d** → all in sync.
- So `git push` ALREADY reaches the repo Hostinger deploys from (via redirect).
- The ONLY missing piece: **Auto-Deployment webhook is not firing** → pushes don't
  trigger a pull → user uploads via File Manager instead. Fix = enable the webhook.
- hPanel GIT page also shows the "Create repository" help confirming install-path
  must be empty — irrelevant now, we're NOT creating; the repo already exists.

## Plan (simple, ZERO destructive steps)
1. [ ] (Safety) Confirm a recent Hostinger backup exists (hPanel → Files → Backups).
       Cheap insurance; not strictly required since nothing is wiped.
2. [ ] (hPanel) In GIT → Manage Repositories → the meriise-foundation row (branch main,
       path /) → ⋮ menu → **Deploy** ONCE manually. Confirm it succeeds with no error
       and the site still looks normal. This validates the public_html git tree is healthy
       (it will reset to origin/main = current live, so no visible change expected).
3. [ ] (hPanel) Same row → ⋮ → **Auto-Deployment** → copy the **Webhook URL**.
4. [ ] (GitHub) Repo → Settings → **Webhooks → Add webhook** → paste URL,
       Content type = application/json, "Just the push event" → Add. (Owner = Darshu03-cell;
       user has access.)
5. [ ] (Test) Claude makes one tiny VISIBLE edit, commit + push (Claude co-author) →
       confirm meriise.org updates within ~1 min (curl/hard-refresh) → revert.
6. [ ] (Habit) STOP uploading via File Manager from now on. All changes via git push
       (Claude can do it), so the git working tree stays clean and deploys keep working.

## Safety notes / watch-outs
- First deploy resets public_html to match origin/main. Since repo == current live
  (index.html byte-identical, 201288 B), expect NO visible change. If the user has any
  un-pushed live edits, they'd be overwritten — evidence says there are none, but the
  step-2 manual Deploy is the safe moment to catch it.
- Server-only files are safe: `.htevtadmin` + `assets/uploads/*` are gitignored (git never
  removes ignored files). `contact_messages.json` is untracked → optionally add to
  .gitignore as cheap insurance so a deploy's cleanup can't remove it.
- `courses/config/*.php` are tracked (prod creds) and reset to committed versions on
  deploy — assumed == current prod. Backup (step 1) lets us compare if needed.
- If step-2 manual Deploy ERRORS (dirty tree / broken .git from past File Manager edits):
  troubleshoot then — may need to re-link the repo or force-reset. Try simple path first.

## Claude does / User does
- Claude: optional gitignore of contact_messages.json; the test edit + commit/push;
  verify live via curl; guide webhook wording.
- User (hPanel + GitHub, I can't access): steps 1–4.

## Progress log
- DONE (commit 13ed0559, pushed): gitignore protection for contact_messages.json +
  sub-site subfolders (events, pragyatha24, pragyatha25, testing2, dev, tbimanage,
  taskscheduler, quiz); untracked empty events/hi. This means a normal deploy
  (reset --hard, or clean -fd) can NOT delete the sub-sites or runtime files. Residual
  risk only if Hostinger uses `git clean -fdx` (removes ignored too) — uncommon;
  backup covers it.
- ⋮ menu options confirmed: Deploy / View latest build output / Auto Deployment / Delete.

## Status — NEXT
User to, in hPanel GIT (meriise-foundation row):
  (a) RECOMMENDED: confirm a backup exists (Files → Backups) before first deploy.
  (b) OPTIONAL extra certainty: click "View latest build output" (read-only) and share
      it, so we confirm the deploy command isn't `clean -fdx`.
  (c) ⋮ → Auto Deployment → copy the Webhook URL → give it to Claude (or add to
      GitHub repo Settings → Webhooks: content-type application/json, push event).
Then Claude pushes a tiny VISIBLE test change and we verify: main site updated AND a
sub-site (e.g. /pragyatha24) still works. Revert test.
