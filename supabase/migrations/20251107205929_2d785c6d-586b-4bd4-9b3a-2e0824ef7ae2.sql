-- Create storage bucket for portal media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portal-media', 'portal-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for portal media
CREATE POLICY "Authenticated users can upload media" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'portal-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view media" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'portal-media');

CREATE POLICY "Users can update their own media" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'portal-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own media" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'portal-media' AND auth.uid()::text = (storage.foldername(name))[1]);