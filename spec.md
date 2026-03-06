# Bloggregator
Bloggregator is my personal RSS/Atom feed aggregator. It aggregates, organizes and displays entries from my favorite blogs. It is a personal project for training my spec-writing, code-writing and architectural skills.

## Corrections

## Still Missing
- **UI section** — the requirements are already written as comments. Uncomment them, assign IDs, and formalize them.
- **Non-functional requirements** — can't stay "to be defined" forever. Start with performance and reliability, even if rough.
- **`blogs` table is missing the feed URL** — you store the base URL, but the cron job needs the actual feed URL to poll. Those are not the same thing.
- **Configuration Schema lacks a formal structure** — written as prose sentences. Should mirror the table format you're already using, or show a sample YAML block.

---

## Specifications

### Functional Requirements
**[F-01]** The system must consume RSS and/or Atom feeds from a list provided by a *config file*, where the admin can add URLs for new feeds at any time. The system must identify whether a feed is an Atom or an RSS feed and parse it accordingly.

#### Polling
**[F-02]** The feeds in the *config file* should be polled according to the **polling frequency**, with a cron job.
**[F-03]** If the system finds multiple feeds from the from the exact same base URL in the *configuration file*, only the first of those must be polled. The remaining must be ignored.
**[F-04]** If a poll to a feed fails, the application must log the failure and store the following information: the feed URL, the date/time it happened, the failure reason, and the error message (a backend exception/panic or a HTTP status code), and then poll the next feed. The failed feed must be polled again normally at the next cycle.
**[F-05]** When obtaining the entries of a blog feed, the application must not persist or update a duplicate entry. A duplicate entry is an entry that already has its `published_at` and `guid` and `blog_id` in the database.


### Data Model
Blogs will be stored into the `blogs` table.
| Field            | Type        | Constraints              | Description 
|------------------|-------------|--------------------------|-------------
| id               | UUID        | PRIMARY KEY              | Internal key
| url              | VARCHAR     | NOT NULL                 | The blog's base URL.
| name             | VARCHAR     | NOT NULL                 | The blog's name.

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

### User Interface
<!--
To-do:
    - All fetched entries should be displayed in the UI, with no pagination, by design. This may be revisited if volume becomes a problem.
    - The User Interface should be a single page application in the web.
    - The UI should display them in reverse chronological order (most recent entries first)
    - As a user, I want to filter entries by which blog they belong to.
-->

### Non-Functional Requirements
To be defined.

### System Constraints
#### Configuration Schema
The configuration file will contain all RSS/Atom feeds that will be polled.
The configuration file will contain an entry that determines the polling frequency, in hours.
The configuration file will contain an entry that determines at which time the polling will start, UTC.

## Open questions/ideas
- ~~Should I use a single table for storing every kind of log in the application, or should I use a table only for polling logs?~~
- Suspend the polling when there are three errors of the same kind, for the same feed?


<!--
- All fetched entries should be displayed in the UI, with no pagination, by design. This may be revisited if volume becomes a problem.
- The User Interface should be a single page application in the web.
- The UI should display them in reverse chronological order (most recent entries first)
- As a user, I want to filter entries by which blog they belong to.
-->
