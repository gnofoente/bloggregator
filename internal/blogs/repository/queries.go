package repository

var upsertBlogsQuery string = `
INSERT INTO blogs (id, url, name, feed_url)
VALUES ($1, $2, $3, $4)
ON CONFLICT (feed_url) DO UPDATE SET
	name 		= EXCLUDED.name,
	url 		= EXCLUDED.url
RETURNING id
;
`

var upsertEntriesQuery string = `
INSERT INTO entries (id, blog_id, published_at, guid, title, url)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (blog_id, guid) DO UPDATE SET
	title 	= EXCLUDED.title,
	url 	= EXCLUDED.url
;
`
