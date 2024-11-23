const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "quran_recitation",
  password: "kariakoo@1",
  port: 5432,
});

// Initialize database tables
const initDb = async () => {
  try {
    // Drop existing tables to ensure clean slate
    await pool.query('DROP TABLE IF EXISTS reciters CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT false
      );
    `);

    // Create reciters table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reciters (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(255),
        assigned_juz INTEGER,
        completed BOOLEAN DEFAULT false,
        FOREIGN KEY (username) REFERENCES users(username)
      );
    `);

    // Insert default reciters if none exist
    const { rows } = await pool.query('SELECT COUNT(*) FROM reciters');
    if (parseInt(rows[0].count) === 0) {
      const defaultReciters = [
        'Reciter 1', 'Reciter 2', 'Reciter 3',
        'Reciter 4', 'Reciter 5', 'Reciter 6'
      ];
      
      for (const name of defaultReciters) {
        await pool.query(
          'INSERT INTO reciters (name, assigned_juz, completed) VALUES ($1, NULL, false)',
          [name]
        );
      }
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = { pool, initDb };