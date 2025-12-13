-- Fix ai_score column to support values 0-100 (was NUMERIC(3,2) which only supports -9.99 to 9.99)
ALTER TABLE leads ALTER COLUMN ai_score TYPE INTEGER USING ai_score::INTEGER;