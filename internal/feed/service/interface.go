package service

import (
	"github.com/gnofoente/bloggregator/internal/blogs/repository"
	"github.com/mmcdole/gofeed"
)

type FeedFetcher interface {
	Fetch(url string) (*gofeed.Feed, error)
}

type FeedSynchronizer interface {
	Sync([]*gofeed.Feed) error
}

type BlogRepository interface {
	UpsertBlogs([]repository.Blog) error
	UpsertEntries([]repository.Entry) error
}
