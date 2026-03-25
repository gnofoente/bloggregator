package repository

import (
	"context"
	"database/sql"
	"errors"
)

type Repository struct {
	db *sql.DB
}

func New(db *sql.DB) *Repository {
	return &Repository{
		db: db,
	}
}

func (r *Repository) UpsertFeedData(ctx context.Context, blogs []Blog, entries []Entry) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	oldToNewIds := make(map[string]string, 0)

	for _, blog := range blogs {
		var id string
		result := tx.QueryRow(upsertBlogsQuery, blog.ID, blog.URL, blog.Name, blog.FeedURL)
		result.Scan(&id)
		oldToNewIds[blog.ID.String()] = id
	}

	for _, entry := range entries {
		newBlogId, ok := oldToNewIds[entry.BlogID.String()]
		if !ok {
			return errors.New("failed to exchange ids for upsert")
		}
		_, err := tx.Exec(upsertEntriesQuery, entry.ID, newBlogId, entry.PublishedAt, entry.GUID, entry.Title, entry.URL)
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}
