package repository

import (
	"time"

	"github.com/google/uuid"
	"github.com/mmcdole/gofeed"
)

type Blog struct {
	ID      uuid.UUID
	URL     string
	Name    string
	FeedURL string
}

func BlogFromFeed(feed *gofeed.Feed) Blog {
	return Blog{
		ID:      uuid.New(),
		URL:     feed.Link,
		Name:    feed.Title,
		FeedURL: feed.FeedLink,
	}
}

type Entry struct {
	ID          uuid.UUID
	BlogID      uuid.UUID
	PublishedAt time.Time
	GUID        string
	Title       string
	URL         string
	Visited     bool
}

func EntryFromFeedItem(item *gofeed.Item, blogId uuid.UUID) Entry {
	published, _ := time.Parse(time.RFC3339, item.Published)

	return Entry{
		ID:          uuid.New(),
		BlogID:      blogId,
		PublishedAt: published,
		GUID:        item.GUID,
		Title:       item.Title,
		URL:         item.Link,
		Visited:     false,
	}
}
