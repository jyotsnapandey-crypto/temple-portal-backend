const pool = require('../config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seed = async () => {
  try {
    console.log('🌱 Seeding database...');

    // States
    await pool.query(`
      INSERT IGNORE INTO states (name, slug) VALUES
        ('Uttar Pradesh', 'uttar-pradesh'),
        ('Rajasthan', 'rajasthan'),
        ('Tamil Nadu', 'tamil-nadu'),
        ('Maharashtra', 'maharashtra'),
        ('Gujarat', 'gujarat')
    `);

    // Cities
    await pool.query(`
      INSERT IGNORE INTO cities (state_id, name, slug) VALUES
        (1, 'Varanasi', 'varanasi'),
        (1, 'Mathura', 'mathura'),
        (2, 'Pushkar', 'pushkar'),
        (3, 'Madurai', 'madurai'),
        (4, 'Shirdi', 'shirdi'),
        (5, 'Dwarka', 'dwarka')
    `);

    // Deities
    await pool.query(`
      INSERT IGNORE INTO deities (name, significance) VALUES
        ('Lord Shiva', 'The destroyer and transformer in the Hindu trinity'),
        ('Lord Vishnu', 'The preserver and protector of the universe'),
        ('Lord Krishna', 'The eighth avatar of Vishnu, deity of love and devotion'),
        ('Goddess Meenakshi', 'Manifestation of Goddess Parvati'),
        ('Sai Baba', 'Revered saint and spiritual master')
    `);

    // Temples
    await pool.query(`
      INSERT IGNORE INTO temples (id, name, description, history, city_id, deity_id, image_url, is_featured, status) VALUES
        (1, 'Kashi Vishwanath Temple',
         'One of the most famous Hindu temples dedicated to Lord Shiva.',
         'The current structure was built by Maratha ruler Ahilya Bai Holkar in 1780.',
         1, 1, '', true, 'approved'),
        (2, 'Dwarkadheesh Temple',
         'Ancient temple dedicated to Lord Krishna, one of the Char Dham pilgrimage sites.',
         'Believed to have been originally built by Krishna grandson Vajranabha over 2500 years ago.',
         6, 3, '', true, 'approved'),
        (3, 'Meenakshi Amman Temple',
         'Historic Hindu temple located on the southern bank of the Vaigai river in Madurai.',
         'The temple was built by Kulasekara Pandya, and the current structure dates back to the 1600s.',
         4, 4, '', true, 'approved'),
        (4, 'Shirdi Sai Baba Temple',
         'Dedicated to Sai Baba of Shirdi, attracting millions of devotees every year.',
         'Sai Baba lived in Shirdi for over 60 years until his mahasamadhi in 1918.',
         5, 5, '', false, 'approved')
    `);

    // Darshan timings
    await pool.query(`
      INSERT IGNORE INTO darshan_timings (temple_id, day_type, open_time, close_time, notes) VALUES
        (1, 'Weekday', '04:00:00', '23:00:00', 'Special aarti at 5 AM and 7 PM'),
        (1, 'Weekend', '03:00:00', '23:00:00', 'Extended morning hours on weekends'),
        (2, 'All Days', '06:00:00', '21:00:00', 'Abhishek puja available from 7 AM'),
        (3, 'All Days', '05:00:00', '21:30:00', 'Afternoon break from 1 PM to 4 PM'),
        (4, 'All Days', '04:00:00', '23:00:00', 'Kakad Aarti at 4:30 AM')
    `);

    // Festivals
    await pool.query(`
      INSERT IGNORE INTO festivals (temple_id, name, festival_date, description) VALUES
        (1, 'Mahashivratri', '2026-02-26', 'The great night of Shiva — overnight puja and fasting observed'),
        (1, 'Dev Deepawali', '2026-11-05', 'Festival of lights on the ghats of Varanasi'),
        (2, 'Janmashtami', '2026-08-16', 'Celebration of Lord Krishna birthday with great devotion'),
        (3, 'Meenakshi Thirukalyanam', '2026-04-20', 'Annual celestial wedding of Goddess Meenakshi')
    `);

    // Visitor info
    await pool.query(`
      INSERT IGNORE INTO visitor_info (temple_id, dress_code, rules, nearby_accommodation, transport_options) VALUES
        (1, 'Traditional Indian attire preferred. No shorts or sleeveless clothing.',
            'No photography inside sanctum. Remove footwear before entry. Mobile phones on silent.',
            'Multiple dharamshalas and hotels available near Dashashwamedh Ghat.',
            'Auto-rickshaws and e-rickshaws available from Varanasi Junction railway station.'),
        (2, 'Modest clothing required. Silk or cotton traditional wear recommended.',
            'No leather items inside temple premises. Maintain silence in sanctum.',
            'Many hotels available in Dwarka city center.',
            'Dwarka railway station is 2 km from the temple.')
    `);

    // Admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT IGNORE INTO admins (name, email, password_hash) VALUES
        ('Temple Admin', 'admin@templeportal.com', ?)
    `, [hashedPassword]);

    console.log('✅ Database seeded successfully!');
    console.log('👤 Admin login: admin@templeportal.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();