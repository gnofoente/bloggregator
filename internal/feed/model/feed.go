package model

import (
	"encoding/xml"
)

type Feed struct {
	XMLName xml.Name `xml:"feed"`
	Title   string   `xml:"title"`
	ID      string   `xml:"id"`
	Updated string   `xml:"updated"`
	Link    []Link   `xml:"link"`
	Author  Author   `xml:"author"`
	Entry   []Entry  `xml:"entry"`
}

type Link struct {
	Href string `xml:"href,attr"`
	Rel  string `xml:"rel,attr"`
}

type Author struct {
	Name string `xml:"name"`
}

type Entry struct {
	Title     string `xml:"title"`
	Link      []Link `xml:"link"`
	ID        string `xml:"id"`
	Published string `xml:"published"`
	Updated   string `xml:"updated"`
	Summary   string `xml:"summary"`
}
