package config

import "errors"

func validate(c Config) error {
	if c.Polling.Frequency > 24 {
		return errors.New("polling frequency cannot be greater than 24 times a day (1 polling cycle per hour)")
	}

	return nil
}
