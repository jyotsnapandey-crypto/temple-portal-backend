CREATE TABLE IF NOT EXISTS visitor_info (
  id SERIAL PRIMARY KEY,
  temple_id INT NOT NULL UNIQUE REFERENCES temples(id) ON DELETE CASCADE,
  dress_code TEXT,
  rules TEXT,
  nearby_accommodation TEXT,
  transport_options TEXT
);
