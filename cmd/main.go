package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"time"

	blogRepository "github.com/gnofoente/bloggregator/internal/blogs/repository"
	"github.com/gnofoente/bloggregator/internal/config"
	feedService "github.com/gnofoente/bloggregator/internal/feed/service"

	_ "github.com/lib/pq"
)

func main() {
	cfg, err := config.Read()
	if err != nil {
		fmt.Fprintf(os.Stderr, "config error: %s", err.Error())
		return
	}

	connStr := fmt.Sprintf("postgres://%s:%s@localhost:5432/bloggregator", "bloggregator", "secret")
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		fmt.Fprintf(os.Stderr, "db conn error: %s", err.Error())
	}
	defer db.Close()

	client := &http.Client{
		Timeout: 30 * time.Second,
	}
	feedSvc := feedService.New(client)

	blogRepo := blogRepository.New(db)
	pollingSvc := feedService.NewPollingService(
		feedSvc,
		cfg.Feeds,
		feedService.NewSyncService(blogRepo),
	)

	fmt.Printf(`
		server starting...
		----
		feeds to poll: %q
		polling starts at: %v
		polling frequency: %v times a day`,
		cfg.Feeds, cfg.Polling.GetStartTime(), cfg.Polling.Frequency,
	)

	pollingSvc.Poll()
}

// for _, url := range cfg.Feeds {
// 	feed, err := svc.Fetch(url)
// 	if err != nil {
// 		fmt.Fprintf(os.Stderr, "\nfailed to fetch: %s", err.Error())
// 		return
// 	}

// 	fmt.Printf("\nit's done! %s at %s", feed.Title, feed.Link)
// }
