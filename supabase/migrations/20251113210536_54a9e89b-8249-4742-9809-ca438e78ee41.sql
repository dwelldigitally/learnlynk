-- Fix Campaigns Table RLS
-- Users should only see and manage their own campaigns

CREATE POLICY "Users can view their own campaigns"
ON campaigns
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns"
ON campaigns
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
ON campaigns
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
ON campaigns
FOR DELETE
USING (auth.uid() = user_id);

-- Fix Emails Table RLS
-- Users should only see emails from their own email accounts

CREATE POLICY "Users can view emails from their accounts"
ON emails
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM email_accounts
    WHERE email_accounts.id = emails.email_account_id
    AND email_accounts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update emails from their accounts"
ON emails
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM email_accounts
    WHERE email_accounts.id = emails.email_account_id
    AND email_accounts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete emails from their accounts"
ON emails
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM email_accounts
    WHERE email_accounts.id = emails.email_account_id
    AND email_accounts.user_id = auth.uid()
  )
);