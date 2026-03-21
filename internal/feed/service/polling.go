package service

import "github.com/mmcdole/gofeed"

type PollingService struct {
	feedFetcher      FeedFetcher
	feeds            []string
	feedSynchronizer FeedSynchronizer
}

func NewPollingService(ff FeedFetcher, feeds []string, fsync FeedSynchronizer) *PollingService {
	return &PollingService{
		feedFetcher:      ff,
		feeds:            feeds,
		feedSynchronizer: fsync,
	}
}

func (p *PollingService) Poll() {
	fetched := make([]*gofeed.Feed, 0)

	for _, url := range p.feeds {
		feed, err := p.feedFetcher.Fetch(url)
		if err != nil {
			// log
		}
		fetched = append(fetched, feed)
	}

	err := p.feedSynchronizer.Sync(fetched)
	if err != nil {
		// log
	}
}
