-- Enable RLS on master data tables
ALTER TABLE master_campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_teams ENABLE ROW LEVEL SECURITY;

-- RLS Policies for master_campuses
CREATE POLICY "Users can view all campuses"
  ON master_campuses FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert campuses"
  ON master_campuses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campuses"
  ON master_campuses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campuses"
  ON master_campuses FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for master_programs
CREATE POLICY "Users can view all programs"
  ON master_programs FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert programs"
  ON master_programs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own programs"
  ON master_programs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own programs"
  ON master_programs FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for master_teams
CREATE POLICY "Users can view all teams"
  ON master_teams FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert teams"
  ON master_teams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teams"
  ON master_teams FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own teams"
  ON master_teams FOR DELETE
  USING (auth.uid() = user_id);