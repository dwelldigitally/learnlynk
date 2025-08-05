-- Delete all student records except Gurpal Dhaliwal and Tushar Malhotra
DELETE FROM students 
WHERE id NOT IN (
    'bb753a03-3eb2-4b98-b93b-c38deaa09429',  -- Tushar Malhotra
    'a6c85dd4-6c93-484e-aa0f-546649049e13'   -- Gurpal Dhaliwal
);