package service

import (
	"encoding/xml"
	"fmt"
	"net/http"

	"github.com/gnofoente/bloggregator/internal/feed/model"
)

type Service struct {
	client *http.Client
}

func New(client *http.Client) *Service {
	return &Service{
		client: client,
	}
}

func (s *Service) Fetch(url string) (*model.Feed, error) {
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

	decoder := xml.NewDecoder(res.Body)
	var feed model.Feed
	err = decoder.Decode(&feed)
	if err != nil {
		return nil, err
	}

	return &feed, nil
}
