<?php
/* =============================================================================
   ME-RIISE  —  Secret Event Admin
   -----------------------------------------------------------------------------
   A private, password-protected page to add / edit / delete events that show up
   on eventsall.html for all visitors.

   FIRST TIME: open this page in your browser, it will ask you to create a
   password. After that it asks for that password to log in.

   Nothing secret is stored in GitHub — your password hash lives in the
   web-inaccessible file ".htevtadmin" next to this file.
   ============================================================================= */

session_start();

/* ----------------------------- Settings ---------------------------------- */
define('PW_FILE',    __DIR__ . '/.htevtadmin');            // bcrypt hash (web-blocked)
define('DATA_FILE',  __DIR__ . '/events_dynamic.json');    // public event data
define('UPLOAD_DIR', __DIR__ . '/assets/uploads');         // where photos are saved
define('UPLOAD_URL', 'assets/uploads');                    // path written into JSON
define('MAX_FILES',  12);
define('MAX_BYTES',  8 * 1024 * 1024);                     // 8 MB per photo
$ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

/* ----------------------------- Helpers ----------------------------------- */
function csrf_token() {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}
function check_csrf() {
    if (empty($_POST['csrf']) || empty($_SESSION['csrf']) ||
        !hash_equals($_SESSION['csrf'], $_POST['csrf'])) {
        http_response_code(400); exit('Bad request (CSRF check failed). Go back and try again.');
    }
}
function logged_in() { return !empty($_SESSION['evt_admin']); }
function h($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

function load_events() {
    if (!file_exists(DATA_FILE)) return [];
    $j = json_decode(@file_get_contents(DATA_FILE), true);
    return is_array($j) ? $j : [];
}
function save_events($arr) {
    file_put_contents(
        DATA_FILE,
        json_encode(array_values($arr), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        LOCK_EX
    );
}
/* Make sure the uploads folder exists AND is protected (no script execution,
   no directory listing). Auto-creating these means fewer files to upload by hand. */
function ensure_upload_dir() {
    if (!is_dir(UPLOAD_DIR) && !@mkdir(UPLOAD_DIR, 0755, true)) return false;
    $ht = UPLOAD_DIR . '/.htaccess';
    if (!file_exists($ht)) {
        @file_put_contents($ht,
            "Options -Indexes -ExecCGI\n" .
            "RemoveHandler .php .phtml .php3 .php4 .php5 .php7 .phps .pl .py .cgi\n" .
            "AddType text/plain .php .phtml .php3 .php4 .php5 .php7 .phps .pl .py .cgi\n" .
            "<FilesMatch \"\\.(php|phtml|php[3-7]|phps|pl|py|cgi|asp|aspx|sh)\$\">\n" .
            "    Require all denied\n" .
            "</FilesMatch>\n"
        );
    }
    $idx = UPLOAD_DIR . '/index.html';
    if (!file_exists($idx)) @file_put_contents($idx, "<!doctype html><title>Not found</title>");
    return true;
}
function go($msg = '', $err = '') {
    $q = [];
    if ($msg !== '') $q['msg'] = $msg;
    if ($err !== '') $q['err'] = $err;
    header('Location: event-admin.php' . ($q ? ('?' . http_build_query($q)) : ''));
    exit;
}
/* Turn an ISO date (YYYY-MM-DD) into a friendly label like "25th September 2026". */
function format_display($iso) {
    $d = DateTime::createFromFormat('Y-m-d', $iso);
    return $d ? $d->format('jS F Y') : $iso;
}

$password_set = file_exists(PW_FILE) && trim((string)@file_get_contents(PW_FILE)) !== '';

/* ----------------------------- POST actions ------------------------------ */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    /* First-run: create the admin password */
    if ($action === 'setup' && !$password_set) {
        $p1 = (string)($_POST['password']  ?? '');
        $p2 = (string)($_POST['password2'] ?? '');
        if (strlen($p1) < 8)  go('', 'Password must be at least 8 characters.');
        if ($p1 !== $p2)      go('', 'The two passwords do not match.');
        if (file_put_contents(PW_FILE, password_hash($p1, PASSWORD_DEFAULT), LOCK_EX) === false)
            go('', 'Could not save the password file. Check folder permissions.');
        @chmod(PW_FILE, 0600);
        session_regenerate_id(true);
        $_SESSION['evt_admin'] = true;
        go('Password created — you are now logged in.');
    }

    /* Login */
    if ($action === 'login' && $password_set) {
        $hash = trim((string)file_get_contents(PW_FILE));
        if (password_verify((string)($_POST['password'] ?? ''), $hash)) {
            session_regenerate_id(true);
            $_SESSION['evt_admin'] = true;
            go('Logged in.');
        }
        sleep(1); // slow down guessing
        go('', 'Wrong password.');
    }

    /* Everything below requires a logged-in session + CSRF token */
    if (!logged_in()) { http_response_code(403); exit('You are not logged in.'); }
    check_csrf();

    if ($action === 'logout') { $_SESSION = []; session_destroy(); go(); }

    /* Add a new event */
    if ($action === 'add') {
        $title    = trim((string)($_POST['title'] ?? ''));
        $sortdate = trim((string)($_POST['sortdate'] ?? ''));
        $display  = trim((string)($_POST['date'] ?? ''));
        $desc     = trim((string)($_POST['description'] ?? ''));

        if ($title === '') go('', 'Please enter a title.');
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $sortdate))
            go('', 'Please pick the event date from the calendar.');
        if ($display === '') $display = format_display($sortdate); // auto label if left blank
        $year = (int)substr($sortdate, 0, 4);

        $saved = [];
        if (!empty($_FILES['photos']) && is_array($_FILES['photos']['name'])) {
            $n = count($_FILES['photos']['name']);
            if ($n > MAX_FILES) go('', 'Too many photos (max ' . MAX_FILES . ').');
            if (!ensure_upload_dir())
                go('', 'Could not create the uploads folder. Check folder permissions.');

            for ($i = 0; $i < $n; $i++) {
                if ($_FILES['photos']['error'][$i] === UPLOAD_ERR_NO_FILE) continue;
                if ($_FILES['photos']['error'][$i] !== UPLOAD_ERR_OK)
                    go('', 'A photo failed to upload (error code ' . $_FILES['photos']['error'][$i] . ').');
                $tmp = $_FILES['photos']['tmp_name'][$i];
                if ($_FILES['photos']['size'][$i] > MAX_BYTES)
                    go('', 'A photo is larger than 8 MB. Please use a smaller image.');
                if (@getimagesize($tmp) === false)
                    go('', 'One of the files is not a valid image.');
                $ext = strtolower(pathinfo($_FILES['photos']['name'][$i], PATHINFO_EXTENSION));
                if (!in_array($ext, $GLOBALS['ALLOWED_EXT'], true))
                    go('', 'Unsupported image type: .' . $ext . ' (use jpg, png, webp or gif).');
                $safe = date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
                if (!move_uploaded_file($tmp, UPLOAD_DIR . '/' . $safe))
                    go('', 'Could not save a photo to the server.');
                $saved[] = UPLOAD_URL . '/' . $safe;
            }
        }
        if (empty($saved)) go('', 'Please add at least one photo.');

        $events = load_events();
        $events[] = [
            'id'          => bin2hex(random_bytes(8)),
            'year'        => $year,
            'sortdate'    => $sortdate,
            'title'       => $title,
            'date'        => $display,
            'description' => $desc,
            'images'      => $saved,
            'created'     => date('c'),
        ];
        save_events($events);
        go('Event published! It is now live on the events page.');
    }

    /* Edit the text of an admin-added event */
    if ($action === 'edit') {
        $id = (string)($_POST['id'] ?? '');
        $events = load_events();
        $found = false;
        foreach ($events as &$e) {
            if (($e['id'] ?? '') === $id) {
                $e['title'] = trim((string)($_POST['title'] ?? $e['title']));
                $sd = trim((string)($_POST['sortdate'] ?? ''));
                if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $sd)) {
                    $e['sortdate'] = $sd;
                    $e['year'] = (int)substr($sd, 0, 4);
                }
                $disp = trim((string)($_POST['date'] ?? ''));
                if ($disp === '' && !empty($e['sortdate'])) $disp = format_display($e['sortdate']);
                if ($disp !== '') $e['date'] = $disp;
                $e['description'] = trim((string)($_POST['description'] ?? ($e['description'] ?? '')));
                $found = true;
                break;
            }
        }
        unset($e);
        if (!$found) go('', 'That event was not found.');
        save_events($events);
        go('Event updated.');
    }

    /* Delete an admin-added event (and its photos) */
    if ($action === 'delete') {
        $id = (string)($_POST['id'] ?? '');
        $events = load_events();
        $kept = [];
        $uploadReal = realpath(UPLOAD_DIR);
        foreach ($events as $e) {
            if (($e['id'] ?? '') === $id) {
                foreach (($e['images'] ?? []) as $img) {
                    $p = realpath(__DIR__ . '/' . $img);
                    if ($p && $uploadReal && strpos($p, $uploadReal) === 0 && is_file($p)) @unlink($p);
                }
            } else {
                $kept[] = $e;
            }
        }
        save_events($kept);
        go('Event deleted.');
    }

    go();
}

/* ----------------------------- View (GET) -------------------------------- */
$msg = $_GET['msg'] ?? '';
$err = $_GET['err'] ?? '';
$events = logged_in() ? load_events() : [];
// newest first for the manage list
usort($events, fn($a, $b) => strcmp($b['created'] ?? '', $a['created'] ?? ''));
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Event Admin · ME-RIISE</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Inter', system-ui, sans-serif; background: linear-gradient(180deg,#070b16,#05070c); color: #f2f7ff; min-height: 100vh; }
  .wrap { width: min(820px, calc(100% - 2rem)); margin: 0 auto; padding: 2.5rem 0 4rem; }
  h1, h2 { font-family: 'Poppins', sans-serif; }
  h1 { font-size: 1.7rem; margin: 0 0 .3rem; }
  .sub { color: #9fb0c6; margin: 0 0 1.8rem; font-size: .95rem; }
  .card { background: rgba(17,24,39,.72); border: 1px solid rgba(255,255,255,.1); border-radius: 16px; padding: 1.6rem; margin-bottom: 1.4rem; }
  label { display: block; font-weight: 600; margin: 1rem 0 .4rem; font-size: .92rem; }
  input[type=text], input[type=password], input[type=number], textarea, select {
    width: 100%; padding: .75rem .9rem; border-radius: 10px; border: 1px solid rgba(255,255,255,.16);
    background: #0b1221; color: #f2f7ff; font: inherit;
  }
  textarea { min-height: 90px; resize: vertical; }
  .row { display: flex; gap: 1rem; flex-wrap: wrap; }
  .row > div { flex: 1; min-width: 160px; }
  .btn { display: inline-block; border: none; border-radius: 10px; padding: .8rem 1.3rem; font: inherit; font-weight: 700;
         background: linear-gradient(135deg,#01adfc,#0176c4); color: #042033; cursor: pointer; margin-top: 1.2rem; }
  .btn:hover { filter: brightness(1.08); }
  .btn.sec { background: transparent; color: #cfe0f3; border: 1px solid rgba(255,255,255,.2); }
  .btn.danger { background: #e2584d; color: #fff; }
  .btn.small { padding: .45rem .8rem; font-size: .82rem; margin-top: 0; }
  .drop { border: 2px dashed rgba(1,173,252,.5); border-radius: 14px; padding: 1.8rem; text-align: center; color: #9fb0c6;
          cursor: pointer; transition: .15s; background: rgba(1,173,252,.04); }
  .drop.hover { border-color: #01adfc; background: rgba(1,173,252,.12); color: #e9f4ff; }
  .previews { display: grid; grid-template-columns: repeat(auto-fill,minmax(90px,1fr)); gap: .6rem; margin-top: 1rem; }
  .previews img { width: 100%; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(255,255,255,.12); }
  .flash { padding: .85rem 1.1rem; border-radius: 10px; margin-bottom: 1.4rem; font-weight: 600; }
  .flash.ok  { background: rgba(46,204,113,.15); border: 1px solid rgba(46,204,113,.5); color: #b8f5d0; }
  .flash.bad { background: rgba(226,88,77,.15);  border: 1px solid rgba(226,88,77,.55);  color: #f7c6c1; }
  .ev { display: flex; gap: 1rem; align-items: center; padding: .9rem 0; border-top: 1px solid rgba(255,255,255,.08); }
  .ev img { width: 64px; height: 48px; object-fit: cover; border-radius: 8px; flex: none; }
  .ev .meta { flex: 1; min-width: 0; }
  .ev .meta b { display: block; }
  .ev .meta span { color: #9fb0c6; font-size: .82rem; }
  .ev .acts { display: flex; gap: .5rem; flex: none; }
  details.edit { margin-top: .5rem; }
  details.edit summary { cursor: pointer; color: #01adfc; font-size: .85rem; }
  .muted { color: #8296ad; font-size: .85rem; }
  a.link { color: #01adfc; }
  .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
</style>
</head>
<body>
<div class="wrap">

  <div class="topbar">
    <div>
      <h1>Event Admin</h1>
      <p class="sub">Add and manage events shown on the public events page.</p>
    </div>
    <?php if (logged_in()): ?>
      <form method="post" style="margin:0">
        <input type="hidden" name="action" value="logout">
        <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
        <button class="btn sec small" type="submit">Log out</button>
      </form>
    <?php endif; ?>
  </div>

  <?php if ($msg): ?><div class="flash ok"><?= h($msg) ?></div><?php endif; ?>
  <?php if ($err): ?><div class="flash bad"><?= h($err) ?></div><?php endif; ?>

<?php if (!$password_set): ?>
  <!-- ============ First run: create password ============ -->
  <div class="card">
    <h2>Create your admin password</h2>
    <p class="muted">This is the first time. Choose a password (at least 8 characters). You'll use it to log in from now on. Keep it safe.</p>
    <form method="post">
      <input type="hidden" name="action" value="setup">
      <label>New password</label>
      <input type="password" name="password" required minlength="8" autocomplete="new-password">
      <label>Repeat password</label>
      <input type="password" name="password2" required minlength="8" autocomplete="new-password">
      <button class="btn" type="submit">Create password &amp; log in</button>
    </form>
  </div>

<?php elseif (!logged_in()): ?>
  <!-- ============ Login ============ -->
  <div class="card">
    <h2>Log in</h2>
    <form method="post">
      <input type="hidden" name="action" value="login">
      <label>Password</label>
      <input type="password" name="password" required autocomplete="current-password" autofocus>
      <button class="btn" type="submit">Log in</button>
    </form>
  </div>

<?php else: ?>
  <!-- ============ Add new event ============ -->
  <div class="card">
    <h2>Add a new event</h2>
    <form method="post" enctype="multipart/form-data" id="addForm">
      <input type="hidden" name="action" value="add">
      <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">

      <label>Photos <span class="muted">(drag &amp; drop, or click — the first photo becomes the cover)</span></label>
      <div class="drop" id="drop">Drop photos here, or click to choose</div>
      <input type="file" id="fileInput" name="photos[]" accept="image/*" multiple hidden>
      <div class="previews" id="previews"></div>

      <label>Event title</label>
      <input type="text" name="title" required placeholder="e.g. Igniting Young Minds 8.0 – Session 4">

      <div class="row">
        <div>
          <label>Event date <span class="muted">(pick from calendar — this orders the events)</span></label>
          <input type="date" name="sortdate" required value="<?= date('Y-m-d') ?>">
        </div>
        <div>
          <label>Date label <span class="muted">(optional — how it reads on the card; blank = auto)</span></label>
          <input type="text" name="date" placeholder="e.g. 22nd to 24th October 2026">
        </div>
      </div>

      <label>Details</label>
      <textarea name="description" placeholder="One or two sentences about what happened."></textarea>

      <button class="btn" type="submit">Publish event</button>
    </form>
  </div>

  <!-- ============ Manage events ============ -->
  <div class="card">
    <h2>Events you've added (<?= count($events) ?>)</h2>
    <?php if (!$events): ?>
      <p class="muted">None yet. Add your first event above — it appears instantly on the events page.</p>
    <?php else: foreach ($events as $e):
        $cover = !empty($e['images'][0]) ? $e['images'][0] : '';
    ?>
      <div class="ev">
        <?php if ($cover): ?><img src="<?= h($cover) ?>" alt=""><?php endif; ?>
        <div class="meta">
          <b><?= h($e['title']) ?></b>
          <span><?= h($e['date']) ?> &middot; <?= (int)($e['year'] ?? 0) ?> &middot; <?= count($e['images'] ?? []) ?> photo(s)</span>
          <details class="edit">
            <summary>Edit text</summary>
            <form method="post" style="margin-top:.6rem">
              <input type="hidden" name="action" value="edit">
              <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
              <input type="hidden" name="id" value="<?= h($e['id']) ?>">
              <label>Title</label>
              <input type="text" name="title" value="<?= h($e['title']) ?>">
              <label>Event date (for ordering)</label>
              <input type="date" name="sortdate" value="<?= h($e['sortdate'] ?? '') ?>">
              <label>Date label (shown on card)</label>
              <input type="text" name="date" value="<?= h($e['date']) ?>">
              <label>Details</label>
              <textarea name="description"><?= h($e['description'] ?? '') ?></textarea>
              <button class="btn small" type="submit">Save changes</button>
              <span class="muted">To change photos, delete this event and add it again.</span>
            </form>
          </details>
        </div>
        <div class="acts">
          <form method="post" onsubmit="return confirm('Delete this event and its photos? This cannot be undone.');">
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
            <input type="hidden" name="id" value="<?= h($e['id']) ?>">
            <button class="btn danger small" type="submit">Delete</button>
          </form>
        </div>
      </div>
    <?php endforeach; endif; ?>
  </div>

  <p class="muted">Tip: open <a class="link" href="eventsall.html" target="_blank">the events page</a> to see your changes (press Ctrl+F5 to refresh).</p>

  <script>
    // Drag & drop + click-to-choose + thumbnails
    const drop = document.getElementById('drop');
    const input = document.getElementById('fileInput');
    const previews = document.getElementById('previews');

    drop.addEventListener('click', () => input.click());
    ['dragenter','dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('hover'); }));
    ['dragleave','drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('hover'); }));
    drop.addEventListener('drop', e => { input.files = e.dataTransfer.files; showPreviews(); });
    input.addEventListener('change', showPreviews);

    function showPreviews() {
      previews.innerHTML = '';
      [...input.files].forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        previews.appendChild(img);
      });
      drop.textContent = input.files.length
        ? input.files.length + ' photo(s) selected — click to change'
        : 'Drop photos here, or click to choose';
    }
  </script>
<?php endif; ?>

</div>
</body>
</html>
