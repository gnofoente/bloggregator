package config

import (
	"time"
)

type Config struct {
	Feeds   []string `yaml:"feeds"`
	Polling Polling  `yaml:"polling"`
}

type Polling struct {
	Frequency int          `yaml:"frequency"`
	StartTime HoursMinutes `yaml:"start_time"`
}

type HoursMinutes time.Time

func (p *Polling) GetStartTime() string {
	return time.Time(p.StartTime).Format("15:04")
}

func (t *HoursMinutes) UnmarshalYAML(unmarshal func(interface{}) error) error {
	var timeStr string
	if err := unmarshal(&timeStr); err != nil {
		return err
	}

	parsed, err := time.Parse("15:04", timeStr)
	if err != nil {
		return err
	}

	*t = HoursMinutes(parsed)
	return nil
}
