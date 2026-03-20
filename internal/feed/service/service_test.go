package service

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestFetch(t *testing.T) {
	t.Run("fetch", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/xml")
			w.Write([]byte(`<feed><title>Test</title></feed>`))
		}))
		defer server.Close()

		svc := New(&http.Client{})

		feed, err := svc.Fetch(server.URL)

		assert.NoError(t, err)
		if assert.NotNil(t, feed) {
			assert.Equal(t, "Test", feed.Title)
		}
	})

	t.Run("fetch error: timeout", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/xml")
			time.Sleep(2 * time.Second)
			w.Write([]byte(`<feed><title>Test</title></feed>`))
		}))
		defer server.Close()

		svc := New(&http.Client{
			Timeout: 1 * time.Second,
		})

		feed, err := svc.Fetch(server.URL)
		assert.Error(t, err)
		assert.Nil(t, feed)
	})

	t.Run("fetch error: bad xml", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/xml")
			w.Write([]byte(`<feed><title>Test</titl></feed>`))
		}))
		defer server.Close()

		svc := New(&http.Client{
			Timeout: 1 * time.Second,
		})

		feed, err := svc.Fetch(server.URL)
		assert.Error(t, err)
		assert.Nil(t, feed)
	})

	t.Run("fetch error: not found", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(404)
		}))
		defer server.Close()

		svc := New(&http.Client{
			Timeout: 1 * time.Second,
		})
		feed, err := svc.Fetch(server.URL)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "HTTP 404")
		assert.Nil(t, feed)
	})
}
