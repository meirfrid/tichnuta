
-- Migrate existing data from courses.locations/times to course_schedules
INSERT INTO course_schedules (course_id, location, day_of_week, start_time)
VALUES 
-- פיתוח משחקים בסקראץ
('b1fc96b5-0a48-42a2-9b95-5b34011e6f25', 'תלמוד תורה שארית ישראל', 'יום שני', '13:40'),

-- פיתוח אפליקציות - 3 schedules
('14a36f64-0683-4c2f-9d82-6d9309d6505d', 'תלמוד תורה שארית ישראל', 'יום שני', '14:40'),
('14a36f64-0683-4c2f-9d82-6d9309d6505d', 'תלמוד תורה שארית ישראל', 'יום רביעי', '14:40'),
('14a36f64-0683-4c2f-9d82-6d9309d6505d', 'אונליין', 'יום חמישי', '18:00'),

-- פיתוח משחקים בפייתון
('78a9d2a6-3085-4abe-ab8e-e2253d2d9a50', 'תלמוד תורה שארית ישראל', 'יום רביעי', '15:40');
