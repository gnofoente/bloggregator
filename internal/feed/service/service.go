package service

import (
	"fmt"
	"net/http"

	"github.com/mmcdole/gofeed"
)

type Service struct {
	client *http.Client
}

func New(client *http.Client) *Service {
	return &Service{
		client: client,
	}
}

func (s *Service) Fetch(url string) (*gofeed.Feed, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	res, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode >= 400 {
		res.Body.Close()
		return nil, fmt.Errorf("HTTP %d", res.StatusCode)
	}

	defer res.Body.Close()

	parser := gofeed.NewParser()
	feed, err := parser.Parse(res.Body)
	if err != nil {
		return nil, err
	}

	return feed, nil
}
