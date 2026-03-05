# Bloggregator
Bloggregator is my personal RSS/Atom feed aggregator. It aggregates, organizes and displays entries from my favorite blogs. It is a personal project for training my spec-writing, code-writing and architectural skills.

## Corrections
- **`blog_entries` is missing `blog_id`** — the table has no foreign key to its parent blog. It's an island. This is a data modeling error, not a style issue.
- **`id` as VARCHAR makes no sense for a surrogate key** — use INTEGER AUTOINCREMENT or justify the choice explicitly.
- **`visited` vs `is_read`** — both terms have been used across iterations. Pick one and be consistent throughout.

## Still Missing
- **`blogs` table** — everything references it and it doesn't exist yet.
- **`polling_logs` table** — F-04 already describes the fields. Just translate it into a table schema.
- **UI section** — the requirements are already written as comments. Uncomment them, assign IDs, and formalize them.
- **Resolve the logging open question** — single log table vs. dedicated polling_logs table. It's a simple architectural decision, make the call.
- **Non-functional requirements** — can't stay "to be defined" forever. Start with performance and reliability, even if rough.

---

## Specifications

### Functional Requirements
**[F-01]** The system must consume RSS and/or Atom feeds from a list provided by a *config file*, where the admin can add URLs for new feeds at any time.

#### Polling
**[F-02]** The feeds in the *config file* should be polled according to the **polling frequency**, with a cron job.
**[F-03]** If the system finds multiple feeds from the from the exact same base URL in the *configuration file*, only the first of those must be polled. The remaining must be ignored.
**[F-04]** If a poll to a feed fails, the application must log the failure and store the following information: the feed URL, the date/time it happened, the failure reason, and the error message (a backend exception/panic or a HTTP status code), and then poll the next feed. The failed feed must polled again normally at the next cycle.
<!-- 
To-do:
    - Existing entries must not be persisted
    - An existing entry is an entry from the same blog that has the same publishing date/unique id
-->

### Data Model
<!-- 
To-do:
    - `blogs` table 
    - polling_logs table
-->
**[F-05]** Blog entries will be stored into the `blog_entries` table.
| Field            | Type        | Constraints              | Description 
|------------------|-------------|--------------------------|-------------
| id               | VARCHAR     | PRIMARY KEY              | The internal key of the entry.
| published_at     | DATETIME    | NOT NULL                 | The date when the entry was posted.
| guid             | VARCHAR     | NOT NULL                 | Feed-provided unique identifier.
| title            | VARCHAR     | NOT NULL                 | The blog entry title.
| url              | VARCHAR     | NOT NULL                 | The URL path to the entry.
| visited          | BOOLEAN     | NOT NULL, DEFAULT FALSE  | If the entry was already visited.

<!--**[F-06]** Polling logs will be stored into the `polling_logs` table.-->

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
- Suspend the polling when there are three errors of the same kind, for the same feed?
- Should I use a single table for storing every kind of log in the application, or should I use a table only for polling logs?


<!--
- The application must consume RSS or Atom feeds from a list provided by a **configuration file**, where the admin user can add URLs for new feeds anytime.
  - What happens if the admin user removes a feed URL from the list? ==The application must keep the existing entries stored, and stop polling that feed==
- The feeds should be polled twice a day, at 00:00 and 12:00 (GMT -3).
  - What happens if the polling fails? ==The application must log the failure and store information: when it happened, the failure reason, error message (that could be a backend exception/panic or a HTTP status code). The feed should be polled normally in the next round. **A good idea for the future could be suspending the polling for three consecutive errors of the same kind, for the same feed.**==
- Once the entries are polled, they should be stored along with their corresponding blog ID, date, URL, and a "read/not read" status
  - The blog ID is the base URL of the feed.
  - If there are more than one feed of the same blog in the config file, the application must fetch the first that appeared.
  - Existing entries must not be persisted. 
  - An existing entry is an entry from the same blog that has the same publishing date/unique id.
- All fetched entries should be displayed in the UI, with no pagination, by design. This may be revisited if volume becomes a problem.
- The User Interface should be a single page application in the web.
- The UI should display them in reverse chronological order (most recent entries first)
- As a user, I want to filter entries by which blog they belong to.

## Open questions
- What should be the format of the config file?
- Should I consider a dynamic polling frequency, adding it as a parameter in the config file?
-->
