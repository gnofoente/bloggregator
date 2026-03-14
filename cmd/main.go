package main

import (
	"fmt"
	"os"

	"github.com/gnofoente/bloggregator/internal/config"
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
		cfg.Feeds, cfg.Polling.GetStartTime(), cfg.Polling.Frequency)
}
