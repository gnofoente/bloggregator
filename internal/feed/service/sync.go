package service

import "github.com/mmcdole/gofeed"

type SyncService struct {
	repo BlogRepository
}

func NewSyncService(blogRepository BlogRepository) *SyncService {
	return &SyncService{
		repo: blogRepository,
	}
}

func (s *SyncService) Sync(feeds []*gofeed.Feed) error {
	return nil
}
