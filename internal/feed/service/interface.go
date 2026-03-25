package service

import (
	"context"

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
	UpsertFeedData(ctx context.Context, blogs []repository.Blog, entries []repository.Entry) error
}
