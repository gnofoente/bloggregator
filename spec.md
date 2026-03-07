# Bloggregator
Bloggregator is my personal RSS/Atom feed aggregator. It aggregates, organizes and displays entries from my favorite blogs. It is a personal project for training my spec-writing, code-writing and architectural skills.

## Blockers (resolve before tasking)

- [ ] **Unify `visited` / `read` field name** — data model uses `visited`, F-11 and F-12 use `read`. Pick one and update all references.
- [ ] **Clarify duplicate detection in F-05** — the current definition includes `published_at` as a duplicate condition, but `UNIQUE(blog_id, guid)` already handles this at the DB level. Remove `published_at` from F-05 or justify its inclusion.
- [ ] **Define the tech stack** — at minimum: backend language/runtime, database engine, and how the SPA communicates with the backend (REST API, etc.).

### Should Be Addressed Soon

- [ ] **Resolve the Feedburner open question** — 3 of the 6 example feeds share feedburner.com as a base URL, making this a real edge case, not a hypothetical. Define how F-03 and F-06 behave in this scenario.
- [ ] **Expand NF-01** — "durable polling schedule" needs a concrete approach (e.g. persisted cron state, job queue, process manager). Different choices have very different implementation costs.
- [ ] **Add a rationale for F-08 (no pagination)** — note the expected data volume this is designed for, so the constraint stays intentional rather than becoming an unexamined assumption.

### Nice to Have

- [ ] **Add remaining non-functional requirements** — performance and reliability targets, even if rough (e.g. expected polling latency, max acceptable UI load time).
- [ ] **Decide on the "suspend after 3 errors" open question** — either add it as a requirement or explicitly close it as out of scope.

---

## Specifications
### Data Model
Blogs will be stored into the `blogs` table.
| Field            | Type        | Constraints              | Description 
|------------------|-------------|--------------------------|-------------
| id               | UUID        | PRIMARY KEY              | Internal key
| url              | VARCHAR     | NOT NULL                 | The blog's base URL.
| name             | VARCHAR     | NOT NULL                 | The blog's name.
| feed_url         | VARCHAR     | NOT NULL, UNIQUE         | The blog's feed URL.

---
Blog entries will be stored into the `entries` table.
| Field            | Type        | Constraints              | Description 
|------------------|-------------|--------------------------|-------------
| id               | UUID        | PRIMARY KEY              | The internal key of the entry.
| blog_id          | UUID        | FOREIGN KEY, NOT NULL    | The related blog id.
| published_at     | DATETIME    | NOT NULL                 | The date when the entry was posted.
| guid             | VARCHAR     | NOT NULL                 | Feed-provided unique identifier.
| title            | VARCHAR     | NOT NULL                 | The blog entry title.
| url              | VARCHAR     | NOT NULL                 | The URL path to the entry.
| visited          | BOOLEAN     | NOT NULL, DEFAULT FALSE  | If the entry was already visited.

**Table constraints:** `UNIQUE(blog_id, guid)`

---
Logs will be stored into the `logs` table.
| Field            | Type        | Constraints              | Description 
|------------------|-------------|--------------------------|-------------
| id               | UUID        | PRIMARY KEY              | Internal key
| service          | VARCHAR     | NOT NULL                 | Could be "polling", "parsing", "database"
| status_code      | VARCHAR     |                          | Status code, if it's an HTTP error
| message          | VARCHAR     | NOT NULL                 | Error message
| failed_at        | DATETIME    | NOT NULL                 | The time when the failure occurred.
| feed_url         | VARCHAR     |                          | The feed url, if it's a polling error.

### Functional Requirements
**[F-01]** The system must consume RSS and/or Atom feeds from a list provided by a *config file*, where the admin can add URLs for new feeds at any time. The system must identify whether a feed is an Atom or an RSS feed and parse it accordingly.

#### Polling
**[F-02]** The feeds in the *config file* should be polled according to the **polling frequency**, with a cron job.
**[F-03]** If the system finds multiple feeds from the exact same URL in the *configuration file*, only the first of those must be polled. The remaining must be ignored.
**[F-04]** If a poll to a feed fails, the application must log the failure and store the following information: the feed URL, the date/time it happened, the failure reason, and the error message (a backend exception/panic or a HTTP status code), and then poll the next feed. The failed feed must be polled again normally at the next cycle.
**[F-05]** When obtaining the entries of a blog feed, the application must not persist or update a duplicate entry. A duplicate entry is an entry that already has its `published_at` and `guid` and `blog_id` in the database.
**[F-06]** At each polling cycle, the system must read the config.yaml file and check for new feed URLs. After a feed is polled for the first time, the system should store the new blog into the `blogs` table with its base URL, name and feed URL. If a feed is removed from the config.yaml file, its `blogs` data and related `entries` should remain unaltered.

### User Interface
**[F-07]** The user interface of the system will be a single page application in the web.
**[F-08]** All fetched entries should be displayed in the UI, with no pagination, by design. 
**[F-09]** The system must display entries sorted by `published_at` in reverse chronological order (most recent entries first)
**[F-10]** As a user of the system, I want to filter entries by which blog they belong to. I can select multiple blogs and filter all entries of those selected blogs. The filter should come with no blogs selected by default (all entries must be shown).
**[F-11]** When I, as an user, click to visit a new entry, the system should mark it as `visited` = true in the database.
**[F-12]** Unvisited entries should have a **New!** label attached to them in the interface. The label must be shown only when `visited` equals false.

### Non-Functional Requirements
**[NF-01]** The system should have a durable way of maintaining its polling schedule on track, even when facing downtime.

### System Constraints
#### Configuration Schema
The configuration schema is as exemplified below: a **config.yaml** file:
```
feeds: 
    - url: https://simonwillison.net/atom/entries/
    - url: https://feeds.feedburner.com/ThePragmaticEngineer
    - url: https://feeds.feedburner.com/TheDailyWtf
    - url: https://jvns.ca/atom.xml
    - url: https://danluu.com/atom.xml
    - url: https://akitaonrails.com/index.xml

polling:
    frequency: 12
    start_time: "00:00"
    
```

## Open questions/ideas
- ~~Should I use a single table for storing every kind of log in the application, or should I use a table only for polling logs?~~
- Suspend the polling when there are three errors of the same kind, for the same feed?
- How to resolve duplicates, considering that many feeds are served in feedburner.com through the same base URL? (feeds.feedburner.com)