-- Clean up duplicate profile rows
-- Keeps only the oldest row (first created), deletes the rest

DELETE FROM profile
WHERE id NOT IN (
  SELECT id
  FROM profile
  ORDER BY created_at ASC
  LIMIT 1
);
