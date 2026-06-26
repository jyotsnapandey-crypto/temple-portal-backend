CREATE TABLE IF NOT EXISTS festivals (
  id SERIAL PRIMARY KEY,
  temple_id INT NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  festival_date DATE,
  description TEXT
);
