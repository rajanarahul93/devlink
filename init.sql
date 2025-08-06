-- Initialize the DevLink database
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- The tables will be created automatically by GORM migrations
-- This file is mainly for any initial data or extensions

-- You can add initial data here if needed
-- INSERT INTO categories (name) VALUES 
--   ('Documentation'),
--   ('Tutorial'),
--   ('Tool'),
--   ('Library'),
--   ('Framework');