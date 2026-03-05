# Bloggregator
Bloggregator is my personal RSS/Atom feed aggregator. It aggregates, organizes and displays entries from my favorite blogs. It is a personal project for training my spec-writing, code-writing and architectural skills.

---

## Specifications

### Functional Requirements
#### Polling
**F-01**: The system must consume RSS and/or Atom feeds from a list provided by a configuration file, where the admin can add URLs for new feeds at any time.

### Non-Functional Requirements

### Data Model

### System Constraints
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
