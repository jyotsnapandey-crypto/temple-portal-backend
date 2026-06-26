CREATE TABLE IF NOT EXISTS temples (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  history TEXT,
  city_id INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  deity_id INT NOT NULL REFERENCES deities(id) ON DELETE CASCADE,
  image_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
