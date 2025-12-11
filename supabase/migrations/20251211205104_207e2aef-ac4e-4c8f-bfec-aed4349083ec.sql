-- Cancel stale pending invitations for users that already exist
UPDATE team_invitations ti
SET status = 'cancelled', updated_at = now()
WHERE ti.status = 'pending'
AND EXISTS (
  SELECT 1 FROM profiles p WHERE LOWER(p.email) = LOWER(ti.email)
);