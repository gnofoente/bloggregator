package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gnofoente/bloggregator/internal/config"
	"github.com/gnofoente/bloggregator/internal/feed/service"
)

func main() {
	cfg, err := config.Read()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error reading config: %s", err.Error())
		return
	}

	fmt.Printf(`
		server starting...
		----
		feeds to poll: %q
		polling starts at: %v
		polling frequency: %v times a day`,
		cfg.Feeds, cfg.Polling.GetStartTime(), cfg.Polling.Frequency,
	)

	client := &http.Client{
		Timeout: 30 * time.Second,
	}
	svc := service.New(client)
	feed, err := svc.Fetch("https://jvns.ca/atom.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "\nfailed to fetch: %s", err.Error())
		return
	}

	fmt.Printf("\nit's done! %s by %s", feed.Title, feed.Author.Name)
}
