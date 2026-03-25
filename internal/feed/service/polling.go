package service

import (
	"fmt"
	"os"

	"github.com/mmcdole/gofeed"
)

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
	visited := make(map[string]int, 0)
	fetchedFeeds := make([]*gofeed.Feed, 0)

	for _, url := range p.feeds {
		// if a url has already been visited, it should not be polled again
		if _, ok := visited[url]; ok {
			continue
		}

		feed, err := p.feedFetcher.Fetch(url)
		if err != nil {
			fmt.Fprintf(os.Stderr, "\nerror fetching: %s", err.Error())
		}

		if feed.FeedLink == "" {
			feed.FeedLink = url
		}

		fetchedFeeds = append(fetchedFeeds, feed)
		visited[url] = 1
	}

	err := p.feedSynchronizer.Sync(fetchedFeeds)
	if err != nil {
		fmt.Fprintf(os.Stderr, "\nerror syncing: %s", err.Error())
	}
}
