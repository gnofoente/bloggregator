import { useState } from "react";

const mockFeeds = [
  {
    id: 1,
    source: "Daring Fireball",
    sourceUrl: "daringfireball.net",
    favicon: "DF",
    color: "#FF3300",
    title: "The Case Against Dark Patterns in Modern UI",
    excerpt: "Dark patterns have evolved from overt manipulation into something subtler and far more insidious — the creeping normalization of friction as a feature.",
    author: "John Gruber",
    date: "2026-03-04T09:15:00",
    readTime: "6 min",
    tags: ["design", "ux"],
    unread: true,
  },
  {
    id: 2,
    source: "Stratechery",
    sourceUrl: "stratechery.com",
    favicon: "S",
    color: "#0000FF",
    title: "The Aggregation Theory, Revisited",
    excerpt: "Ten years on, the dynamics of platform aggregation are playing out exactly as predicted — but with one critical wrinkle nobody anticipated.",
    author: "Ben Thompson",
    date: "2026-03-04T07:30:00",
    readTime: "12 min",
    tags: ["tech", "business"],
    unread: true,
  },
  {
    id: 3,
    source: "Hacker News",
    sourceUrl: "hnrss.org",
    favicon: "Y",
    color: "#FF6600",
    title: "Show HN: I built a terminal-first RSS reader in Zig",
    excerpt: "After two years of dissatisfaction with existing solutions, I wrote my own. It parses 400 feeds in under 80ms cold and runs entirely in the terminal.",
    author: "threedots",
    date: "2026-03-03T22:00:00",
    readTime: "3 min",
    tags: ["zig", "rss", "tools"],
    unread: false,
  },
  {
    id: 4,
    source: "Cassidy Williams",
    sourceUrl: "cassidoo.co",
    favicon: "CW",
    color: "#CC00FF",
    title: "How I Rebuilt My Blog With Zero Dependencies",
    excerpt: "Every few years I throw everything away and start over. This time the constraint was simple: ship no JavaScript to the client unless I wrote every byte.",
    author: "Cassidy Williams",
    date: "2026-03-03T18:45:00",
    readTime: "8 min",
    tags: ["webdev", "minimalism"],
    unread: false,
  },
  {
    id: 5,
    source: "ACM Queue",
    sourceUrl: "queue.acm.org",
    favicon: "Q",
    color: "#007700",
    title: "Memory Safety Without Garbage Collection",
    excerpt: "A thorough comparison of the ownership models emerging across systems programming languages, and what they mean for the future of safe systems code.",
    author: "Various Authors",
    date: "2026-03-03T14:00:00",
    readTime: "20 min",
    tags: ["systems", "pl"],
    unread: true,
  },
  {
    id: 6,
    source: "Lenny's Newsletter",
    sourceUrl: "lennysnewsletter.com",
    favicon: "LN",
    color: "#FF3300",
    title: "The Product Manager's Guide to Saying No",
    excerpt: "The hardest skill in product isn't prioritization — it's articulating why you're not building something in a way that doesn't demoralize the team.",
    author: "Lenny Rachitsky",
    date: "2026-03-02T11:00:00",
    readTime: "9 min",
    tags: ["product", "leadership"],
    unread: false,
  },
  {
    id: 7,
    source: "Overreacted",
    sourceUrl: "overreacted.io",
    favicon: "OR",
    color: "#0000FF",
    title: "React Compiler: What Changes for You",
    excerpt: "The React compiler is no longer experimental. Here's a grounded look at what it actually does, what it doesn't do, and when you should care.",
    author: "Dan Abramov",
    date: "2026-03-02T08:20:00",
    readTime: "14 min",
    tags: ["react", "javascript"],
    unread: true,
  },
  {
    id: 8,
    source: "Paul Graham",
    sourceUrl: "paulgraham.com",
    favicon: "PG",
    color: "#007700",
    title: "Cities and Ambition, Revisited",
    excerpt: "Every city sends a message. Revisiting a 2008 essay in a world where remote work has fundamentally changed which messages reach which people.",
    author: "Paul Graham",
    date: "2026-03-01T16:30:00",
    readTime: "11 min",
    tags: ["essays", "culture"],
    unread: false,
  },
];

const allTags = [...new Set(mockFeeds.flatMap((f) => f.tags))];
const allSources = [...new Set(mockFeeds.map((f) => f.source))];

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}M AGO`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}H AGO`;
  return `${Math.floor(diff / 86400)}D AGO`;
}

export default function FeedAggregator() {
  const [filter, setFilter] = useState("all");
  const [activeTag, setActiveTag] = useState(null);
  const [activeSource, setActiveSource] = useState(null);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(mockFeeds);
  const [layout, setLayout] = useState("list");

  const unreadCount = entries.filter((e) => e.unread).length;

  const filtered = entries.filter((e) => {
    if (filter === "unread" && !e.unread) return false;
    if (filter === "read" && e.unread) return false;
    if (activeTag && !e.tags.includes(activeTag)) return false;
    if (activeSource && e.source !== activeSource) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) &&
        !e.excerpt.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const markRead = (id) =>
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, unread: false } : e));

  const markAllRead = () =>
    setEntries((prev) => prev.map((e) => ({ ...e, unread: false })));

  return (
    <div style={{ minHeight: "100vh", background: "#F2EFE9", color: "#111", fontFamily: "courier new, courier, monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Courier+Prime:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .entry-row {
          border-bottom: 3px solid #111;
          padding: 14px 20px 14px 0;
          cursor: pointer;
          display: grid;
          grid-template-columns: 34px 52px 1fr auto;
          gap: 0 14px;
          align-items: start;
        }
        .entry-row:hover { background: #E5E1D8; }
        .entry-row.unread { background: #FFFFFF; }
        .entry-row.unread:hover { background: #F5F5F0; }

        .entry-card {
          border: 3px solid #111;
          padding: 16px;
          cursor: pointer;
          background: #fff;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 5px 5px 0 #111;
          transition: transform 0.06s, box-shadow 0.06s;
        }
        .entry-card:hover { transform: translate(-2px, -2px); box-shadow: 7px 7px 0 #111; }
        .entry-card.read { background: #F2EFE9; box-shadow: 5px 5px 0 #AAAAAA; border-color: #AAAAAA; }
        .entry-card.read:hover { box-shadow: 7px 7px 0 #AAAAAA; }

        .side-btn {
          display: block; width: 100%; text-align: left;
          background: none; border: none; border-left: 3px solid transparent;
          padding: 6px 8px;
          font-family: 'Courier Prime', 'Courier New', monospace;
          font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
          cursor: pointer; color: #777;
          transition: color 0.1s, border-color 0.1s, background 0.1s;
        }
        .side-btn:hover { color: #111; border-color: #111; background: #E5E1D8; }
        .side-btn.active { color: #111; border-color: #111; background: #E5E1D8; }

        .tag-btn {
          font-family: 'Courier Prime', 'Courier New', monospace;
          font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
          padding: 3px 7px; border: 2px solid #111; background: #F2EFE9;
          cursor: pointer; transition: background 0.1s, color 0.1s; white-space: nowrap;
        }
        .tag-btn:hover, .tag-btn.active { background: #111; color: #F2EFE9; }

        .search-input {
          font-family: 'Courier Prime', 'Courier New', monospace;
          font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
          padding: 6px 10px; border: 3px solid #111; background: #fff; color: #111;
          outline: none; width: 180px;
        }
        .search-input::placeholder { color: #AAA; }
        .search-input:focus { background: #FFFDE0; }

        .layout-btn {
          font-size: 14px; font-weight: 700;
          border: 3px solid #111; background: #F2EFE9; color: #111;
          cursor: pointer; padding: 4px 10px;
          transition: background 0.1s, color 0.1s; line-height: 1;
        }
        .layout-btn:hover, .layout-btn.active { background: #111; color: #F2EFE9; }

        .mark-read-btn {
          background: none; border: 2px solid #BBBBBB; color: #BBBBBB;
          font-size: 9px; font-family: 'Courier Prime', monospace; font-weight: 700;
          cursor: pointer; padding: 3px 7px; text-transform: uppercase; letter-spacing: 0.07em;
          transition: all 0.1s; white-space: nowrap;
        }
        .mark-read-btn:hover { border-color: #FF3300; color: #FF3300; }

        .favicon-box {
          width: 44px; height: 44px; border: 3px solid currentColor;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', monospace; font-size: 12px; letter-spacing: 0.03em; flex-shrink: 0;
        }

        .new-badge {
          font-family: 'Bebas Neue', sans-serif; font-size: 9px; letter-spacing: 0.1em;
          background: #FF3300; color: #fff; padding: 2px 5px; line-height: 1.3; display: inline-block;
        }

        .section-label {
          font-family: 'Bebas Neue', monospace; font-size: 13px; letter-spacing: 0.18em;
          text-transform: uppercase; color: #111; border-bottom: 3px solid #111;
          padding-bottom: 4px; margin-bottom: 8px;
        }

        .filter-seg-btn {
          font-family: 'Courier Prime', monospace; font-weight: 700; font-size: 11px;
          letter-spacing: 0.07em; text-transform: uppercase;
          padding: 5px 13px; background: #F2EFE9; color: #111;
          border: none; cursor: pointer; transition: background 0.1s, color 0.1s;
        }
        .filter-seg-btn.active { background: #111; color: #F2EFE9; }
        .filter-seg-btn:hover:not(.active) { background: #E0DDD5; }
      `}</style>

      {/* Header black bar */}
      <header style={{ background: "#111", borderBottom: "4px solid #111", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", height: 40,
        }}>
          <div style={{ fontFamily: "'Bebas Neue', monospace", fontSize: 26, letterSpacing: "0.2em", color: "#F2EFE9", lineHeight: 1 }}>
            DISPATCH
          </div>
          <div style={{ display: "flex", gap: 24, fontFamily: "'Courier Prime', monospace", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em" }}>
            <span style={{ color: "#888" }}>RSS / ATOM AGGREGATOR</span>
            <span style={{ color: "#FF3300" }}>{unreadCount} UNREAD</span>
            <span style={{ color: "#555" }}>WED 04 MAR 2026</span>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{
          background: "#F2EFE9", borderTop: "3px solid #111",
          display: "flex", alignItems: "center", gap: 10, padding: "8px 20px",
        }}>
          <div style={{ border: "3px solid #111", display: "flex", overflow: "hidden" }}>
            {["all", "unread", "read"].map((f, i) => (
              <button
                key={f}
                className={`filter-seg-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
                style={{ borderLeft: i > 0 ? "2px solid #111" : "none" }}
              >
                {f === "unread" ? `UNREAD (${unreadCount})` : f.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          <input
            className="search-input"
            placeholder="SEARCH..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div style={{ display: "flex", gap: 4 }}>
            <button className={`layout-btn ${layout === "list" ? "active" : ""}`} onClick={() => setLayout("list")}>☰</button>
            <button className={`layout-btn ${layout === "card" ? "active" : ""}`} onClick={() => setLayout("card")}>⊞</button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              style={{
                fontFamily: "'Courier Prime', monospace", fontWeight: 700, fontSize: 11,
                letterSpacing: "0.07em", textTransform: "uppercase",
                padding: "5px 12px", border: "3px solid #111", background: "#FFFDE0", color: "#111", cursor: "pointer",
              }}
            >
              MARK ALL READ
            </button>
          )}
        </div>
      </header>

      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <aside style={{
          width: 196, borderRight: "3px solid #111",
          padding: "18px 14px", flexShrink: 0,
          position: "sticky", top: 83, height: "calc(100vh - 83px)", overflowY: "auto",
          background: "#E8E4DC",
        }}>
          <div className="section-label">SOURCES</div>
          <div style={{ marginBottom: 20 }}>
            {allSources.map((src) => {
              const feed = mockFeeds.find((f) => f.source === src);
              const isActive = activeSource === src;
              return (
                <button
                  key={src}
                  className={`side-btn ${isActive ? "active" : ""}`}
                  style={isActive ? { borderColor: feed.color, color: feed.color, background: feed.color + "18" } : {}}
                  onClick={() => setActiveSource(activeSource === src ? null : src)}
                >
                  {src}
                </button>
              );
            })}
          </div>

          <div className="section-label">TAGS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`tag-btn ${activeTag === tag ? "active" : ""}`}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {(activeTag || activeSource || search || filter !== "all") && (
            <button
              onClick={() => { setActiveTag(null); setActiveSource(null); setSearch(""); setFilter("all"); }}
              style={{
                marginTop: 18, fontFamily: "'Courier Prime', monospace", fontWeight: 700,
                fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "5px 10px", border: "2px solid #FF3300",
                background: "none", color: "#FF3300", cursor: "pointer", width: "100%",
              }}
            >
              ✕ CLEAR FILTERS
            </button>
          )}
        </aside>

        {/* Main */}
        <main style={{ flex: 1 }}>
          {/* Count bar */}
          <div style={{
            borderBottom: "3px solid #111", padding: "8px 20px",
            background: "#E8E4DC", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", color: "#555" }}>
              — {filtered.length} ENTRIES
              {activeTag && <span style={{ color: "#111" }}> / #{activeTag.toUpperCase()}</span>}
              {activeSource && <span style={{ color: "#111" }}> / {activeSource.toUpperCase()}</span>}
              {search && <span style={{ color: "#111" }}> / "{search.toUpperCase()}"</span>}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: "80px 20px", fontFamily: "'Bebas Neue', monospace", fontSize: 40, letterSpacing: "0.1em", color: "#CCC", textAlign: "center" }}>
              NO ENTRIES FOUND
            </div>
          ) : layout === "list" ? (
            <div style={{ paddingLeft: 20 }}>
              {filtered.map((entry) => {
                const feed = mockFeeds.find((f) => f.id === entry.id);
                return (
                  <div key={entry.id} className={`entry-row ${entry.unread ? "unread" : ""}`} onClick={() => markRead(entry.id)}>
                    {/* New badge col */}
                    <div style={{ paddingTop: 3 }}>
                      {entry.unread && <span className="new-badge">NEW</span>}
                    </div>

                    {/* Favicon */}
                    <div
                      className="favicon-box"
                      style={{
                        color: entry.unread ? feed.color : "#AAAAAA",
                        background: entry.unread ? feed.color + "18" : "transparent",
                      }}
                    >
                      {entry.favicon}
                    </div>

                    {/* Content */}
                    <div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 5, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'Bebas Neue', monospace", fontSize: 13, letterSpacing: "0.1em", color: feed.color }}>
                          {entry.source.toUpperCase()}
                        </span>
                        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, fontWeight: 700, color: "#999", letterSpacing: "0.07em" }}>
                          {timeAgo(entry.date)} · {entry.readTime.toUpperCase()} READ
                        </span>
                        {entry.tags.map((tag) => (
                          <button
                            key={tag}
                            className={`tag-btn ${activeTag === tag ? "active" : ""}`}
                            style={{ fontSize: 9, padding: "1px 5px", borderWidth: "2px" }}
                            onClick={(e) => { e.stopPropagation(); setActiveTag(activeTag === tag ? null : tag); }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>

                      <div style={{
                        fontFamily: "'Bebas Neue', monospace",
                        fontSize: entry.unread ? 22 : 18,
                        letterSpacing: "0.04em", lineHeight: 1.1,
                        color: entry.unread ? "#111" : "#999", marginBottom: 6,
                      }}>
                        {entry.title}
                      </div>

                      <div style={{
                        fontFamily: "'Courier Prime', monospace", fontSize: 12,
                        color: entry.unread ? "#444" : "#AAA", lineHeight: 1.6, maxWidth: 680,
                      }}>
                        {entry.excerpt}
                      </div>
                    </div>

                    {/* Action */}
                    <div style={{ paddingTop: 3 }}>
                      <button className="mark-read-btn" onClick={(e) => { e.stopPropagation(); markRead(entry.id); }}>
                        MARK READ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {filtered.map((entry) => {
                const feed = mockFeeds.find((f) => f.id === entry.id);
                return (
                  <div
                    key={entry.id}
                    className={`entry-card ${entry.unread ? "" : "read"}`}
                    onClick={() => markRead(entry.id)}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          className="favicon-box"
                          style={{
                            width: 36, height: 36, fontSize: 11,
                            color: entry.unread ? feed.color : "#AAAAAA",
                            background: entry.unread ? feed.color + "18" : "transparent",
                          }}
                        >
                          {entry.favicon}
                        </div>
                        <span style={{ fontFamily: "'Bebas Neue', monospace", fontSize: 13, letterSpacing: "0.08em", color: feed.color }}>
                          {entry.source.toUpperCase()}
                        </span>
                      </div>
                      {entry.unread && <span className="new-badge">NEW</span>}
                    </div>

                    <div style={{
                      fontFamily: "'Bebas Neue', monospace", fontSize: 19,
                      letterSpacing: "0.03em", lineHeight: 1.1,
                      color: entry.unread ? "#111" : "#999",
                      borderTop: `3px solid ${entry.unread ? feed.color : "#CCCCCC"}`,
                      paddingTop: 10,
                    }}>
                      {entry.title}
                    </div>

                    <div style={{
                      fontFamily: "'Courier Prime', monospace", fontSize: 11,
                      color: entry.unread ? "#444" : "#AAA", lineHeight: 1.6,
                      overflow: "hidden", display: "-webkit-box",
                      WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
                    }}>
                      {entry.excerpt}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {entry.tags.map((tag) => (
                          <button
                            key={tag}
                            className={`tag-btn ${activeTag === tag ? "active" : ""}`}
                            style={{ fontSize: 9, padding: "1px 5px", borderWidth: "2px" }}
                            onClick={(e) => { e.stopPropagation(); setActiveTag(activeTag === tag ? null : tag); }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <span style={{ fontFamily: "'Courier Prime', monospace", fontWeight: 700, fontSize: 10, letterSpacing: "0.07em", color: "#999" }}>
                        {timeAgo(entry.date)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
