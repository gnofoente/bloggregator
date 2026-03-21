package repository

type Repository struct{}

func New() *Repository {
	return &Repository{}
}

func (r *Repository) UpsertBlogs(blogs []Blog) error {
	return nil
}

func (r *Repository) UpsertEntries(entries []Entry) error {
	return nil
}
