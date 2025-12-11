-- Clean up legacy campaigns table data (campaigns are no longer used)
DELETE FROM campaigns;

-- Clean up plays without proper trigger_config.elements (non-functional workflows)
DELETE FROM plays 
WHERE trigger_config IS NULL 
   OR trigger_config::jsonb->'elements' IS NULL 
   OR jsonb_array_length(trigger_config::jsonb->'elements') = 0;