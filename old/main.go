package main

import (
	"encoding/xml"
	"fmt"
	"os"
	"time"
)

type Feed struct {
	XMLName xml.Name `xml:"http://www.w3.org/2005/Atom feed"`
	Title   string   `xml:"title"`
	Entries []Entry  `xml:"entry"`
}

type Entry struct {
	Title     string     `xml:"title"`
	Link      Link       `xml:"link"`
	Published string     `xml:"published"`
	Tags      []Category `xml:"category"`
}

type Link struct {
	Href string `xml:"href,attr"`
}

type Category struct {
	Term string `xml:"term,attr"`
}

func main() {
	data, err := os.ReadFile("simon.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "error reading file: %v\n", err)
		os.Exit(1)
	}

	var feed Feed
	if err := xml.Unmarshal(data, &feed); err != nil {
		fmt.Fprintf(os.Stderr, "error parsing XML: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Feed: %s\n", feed.Title)
	fmt.Printf("Total posts: %d\n\n", len(feed.Entries))

	for i, entry := range feed.Entries {
		t, _ := time.Parse(time.RFC3339, entry.Published)

		fmt.Printf("[%d] %s\n", i+1, entry.Title)
		fmt.Printf("    URL:  %s\n", entry.Link.Href)
		fmt.Printf("    Date: %s\n", t.Format("2006-01-02"))

		tags := make([]string, len(entry.Tags))
		for j, cat := range entry.Tags {
			tags[j] = cat.Term
		}
		fmt.Printf("    Tags: %v\n\n", tags)
	}
}
