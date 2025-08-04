-- Add indexes for better performance on student management
CREATE INDEX IF NOT EXISTS idx_students_stage ON public.students(stage);
CREATE INDEX IF NOT EXISTS idx_students_program ON public.students(program);
CREATE INDEX IF NOT EXISTS idx_students_risk_level ON public.students(risk_level);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON public.students(created_at);
CREATE INDEX IF NOT EXISTS idx_students_user_id_created_at ON public.students(user_id, created_at);

-- Add full-text search index for student names and emails
CREATE INDEX IF NOT EXISTS idx_students_search ON public.students USING gin(
  to_tsvector('english', first_name || ' ' || last_name || ' ' || email)
);

-- Add compound index for common filtering scenarios
CREATE INDEX IF NOT EXISTS idx_students_user_stage_program ON public.students(user_id, stage, program);
CREATE INDEX IF NOT EXISTS idx_students_user_risk ON public.students(user_id, risk_level);