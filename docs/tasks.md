# Bloggregator — Task Breakdown

## Phase 1: Project Setup

- [x] **T-01** Initialize Go module and project directory structure (`cmd/`, `internal/`, `config/`, `db/`)
- [x] **T-02** Initialize React project (Vite or CRA) in a `frontend/` directory
- [x] **T-03** Set up PostgreSQL locally (Docker Compose or local install) and create the database
- [x] **T-04** Write a `Makefile` (or scripts) with targets: `run`, `build`, `migrate`, `dev`

---

## Phase 2: Database

- [x] **T-05** Write migration: create `blogs` table
- [x] **T-06** Write migration: create `entries` table (with `UNIQUE(blog_id, guid)` constraint)
- [x] **T-07** Write migration: create `logs` table
- [ ] ~~**T-08** Integrate a migration runner (e.g. `golang-migrate`) that runs on startup~~

---

## Phase 3: Configuration

- [x] **T-09** Define and document the `config.yaml` schema (feeds list + polling frequency/start_time)
- [x] **T-10** Write a Go config loader that reads `config.yaml` at startup and on each polling cycle
- [x] **T-10** Validate `config.yaml` at startup and on each polling cycle

---

## Phase 4: Feed Polling Engine

- [x] **T-11** Write an RSS/Atom feed fetcher (HTTP GET with proper User-Agent)
- [ ] **T-12** Write an RSS parser (handle `<rss>` format, extract: title, guid, url, published_at)
- [ ] **T-13** Write an Atom parser (handle `<feed>` format, extract: title, id/guid, link, published/updated)
- [ ] **T-14** Write feed type detection logic (RSS vs Atom) and route to the correct parser
- [ ] **T-15** Write duplicate detection: skip entries where `(blog_id, guid)` already exists in `entries`
- [ ] **T-16** Write the `blogs` upsert logic: on first poll, insert blog with name (from feed metadata), base URL, and feed URL
- [ ] **T-17** Write deduplication of feed URLs within the config (only poll the first occurrence per URL — F-03)
- [ ] **T-18** Write error logging: on poll failure, insert a row into `logs` with feed URL, timestamp, error message, and status code if HTTP
- [ ] **T-19** Wire up the full polling cycle: load config -> deduplicate URLs -> fetch+parse each feed -> upsert blog -> insert new entries -> log errors

---

## Phase 5: Scheduler

- [ ] **T-20** Implement a cron scheduler (e.g. `robfig/cron`) that triggers the polling cycle based on `polling.frequency` and `polling.start_time` from config
- [ ] **T-21** Ensure polling only runs when the process is online (NF-01 — cron is inherently process-scoped; document this behavior)

---

## Phase 6: REST API

- [ ] **T-22** Set up an HTTP router (e.g. `chi` or `net/http`) with middleware for JWT validation
- [ ] **T-23** `GET /entries` — return all entries sorted by `published_at` DESC, with blog info attached
- [ ] **T-24** `GET /blogs` — return all blogs (for the filter UI)
- [ ] **T-25** `PATCH /entries/:id/visited` — mark an entry as `visited = true`
- [ ] **T-26** Write JWT issuance (login endpoint or static token generation for personal use)
- [ ] **T-27** Add CORS configuration so the React frontend can call the API

---

## Phase 7: Frontend — Core UI

- [ ] **T-28** Set up API client (Axios or fetch wrapper) with JWT token injection
- [ ] **T-29** Build the entries list component: display title, blog name, published date, and entry URL
- [ ] **T-30** Display all entries with no pagination (F-08), sorted by `published_at` DESC (F-09)
- [ ] **T-31** Show a "New!" label on entries where `visited === false` (F-12)
- [ ] **T-32** On entry click: open URL in a new tab and call `PATCH /entries/:id/visited` to mark as visited (F-11)

---

## Phase 8: Frontend — Filter

- [ ] **T-33** Build a blog filter component: list all blogs as selectable items (multi-select)
- [ ] **T-34** Default state: no blogs selected = show all entries (F-10)
- [ ] **T-35** When one or more blogs are selected, filter the entries list client-side to matching blogs

---

## Phase 9: Integration & Polish

- [ ] **T-36** End-to-end test: add a feed to `config.yaml`, trigger a poll, verify entries appear in the UI
- [ ] **T-37** Verify duplicate prevention: poll the same feed twice, confirm no duplicate entries
- [ ] **T-38** Verify Feedburner edge case: two feeds sharing `feeds.feedburner.com` base URL are treated as distinct feeds (different `feed_url`), only exact-URL duplicates are skipped (F-03)
- [ ] **T-39** Verify error logging: point a feed URL at a bad URL, confirm a log row is written and polling continues
- [ ] **T-40** UI smoke test: filter, "New!" label, visited marking all work correctly

---

## Deferred / Out of Scope

- Suspend polling after 3 consecutive errors for the same feed (explicitly out of scope)
- Pagination (intentionally excluded per F-08; revisit if feed/entry volume grows)
- Additional non-functional requirements (performance/reliability targets beyond NF-02)
