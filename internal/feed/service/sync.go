package service

import (
	"context"

	"github.com/gnofoente/bloggregator/internal/blogs/repository"
	"github.com/mmcdole/gofeed"
)

type SyncService struct {
	repo BlogRepository
}

func NewSyncService(blogRepository BlogRepository) *SyncService {
	return &SyncService{
		repo: blogRepository,
	}
}

func (s *SyncService) Sync(feeds []*gofeed.Feed) error {
	/* the sync function will receive a list of feeds. it will upsert blogs and their corresponding entries in the database. */
	blogs := make([]repository.Blog, 0)
	entries := make([]repository.Entry, 0)

	for _, feed := range feeds {
		blog := repository.BlogFromFeed(feed)
		blogs = append(blogs, blog)

		for _, item := range feed.Items {
			entries = append(entries, repository.EntryFromFeedItem(item, blog.ID))
		}
	}

	return s.repo.UpsertFeedData(context.Background(), blogs, entries)
}
