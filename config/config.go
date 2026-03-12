package config

import (
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Feeds   []Feed  `yaml:"feeds"`
	Polling Polling `yaml:"polling"`
}

type Feed struct {
	URL string `yaml:"url"`
}

type Polling struct {
	Frequency int    `yaml:"frequency"`
	StartTime string `yaml:"start_time"`
}

func Read() (*Config, error) {
	data, err := os.ReadFile("config/config.yaml")
	if err != nil {
		return nil, err
	}

	var cfg Config
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}
