package service

import (
	"encoding/xml"
	"io"
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
	req, _ := http.NewRequest("GET", url, nil)
	res, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()
	data, err := io.ReadAll(res.Body)

	var feed model.Feed
	if err := xml.Unmarshal(data, &feed); err != nil {
		return nil, err
	}

	return &feed, nil
}
