#!/usr/bin/env node

/**
 * Helper script to generate bcrypt password hash for admin authentication
 * Usage: node scripts/generate-password-hash.js <password>
 */

import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/generate-password-hash.js <password>');
  process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }
  
  console.log('\nPassword hash generated successfully!\n');
  console.log('Add this to your .env file:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
});
