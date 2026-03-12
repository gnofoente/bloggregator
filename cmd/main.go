package main

import (
	"fmt"
	"os"

	"github.com/gnofoente/bloggregator/config"
)

func main() {
	cfg, err := config.Read()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error reading config: %s", err.Error())
	}
	fmt.Printf("%v", cfg)
}
