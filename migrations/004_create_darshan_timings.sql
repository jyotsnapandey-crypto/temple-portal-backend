CREATE TABLE IF NOT EXISTS darshan_timings (
  id SERIAL PRIMARY KEY,
  temple_id INT NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  day_type VARCHAR(50) NOT NULL,
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  notes TEXT
);
