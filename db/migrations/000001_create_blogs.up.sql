CREATE TABLE blogs (
    id          UUID    PRIMARY KEY,
    url         VARCHAR NOT NULL,
    name        VARCHAR NOT NULL,
    feed_url    VARCHAR UNIQUE NOT NULL
);

CREATE TABLE entries (
    id              UUID PRIMARY KEY,
    blog_id         UUID REFERENCES blogs(id) NOT NULL,
    published_at    TIMESTAMPTZ NOT NULL,
    guid            VARCHAR NOT NULL,
    title           VARCHAR NOT NULL,
    url             VARCHAR NOT NULL,
    visited         BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(blog_id, guid)
);

CREATE TABLE logs (
    id UUID         PRIMARY KEY,
    service         VARCHAR NOT NULL,
    status_code     VARCHAR,
    message         VARCHAR NOT NULL,
    failed_at       TIMESTAMPTZ NOT NULL,
    feed_url        VARCHAR
);