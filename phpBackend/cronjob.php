<?php

require_once('mysql_connect.php');

$clearTable = "TRUNCATE TABLE students";

$clearTableResult = $conn->query($clearTable);

$cronData = "INSERT INTO `students` (`name`, `course`, `grade`) VALUES
('Matthew', 'Finance', 99),
('Nick', 'Accounting', 91),
('Anthony', 'Engineering', 95),
('Abdullah', 'Quantum Computing', 98),
('Lindsay', 'Satistics', 92),
('Frank', 'Business', 94),
('Violet', 'Sociology', 96),
('Vishak', 'Cyber Security', 97),
('Dillon', 'Genetics', 98),
('Nathan', 'Engineering', 94),
('Jarryd', 'Psychology', 94),
('Keith', 'Computer Science', 85),
('Khaleel', 'Web Development', 100),
('Brenda', 'Earth System Sciences', 99),
('Aaron', 'Graphic Design', 98),
('Nick', 'Sociology', 92),
('Kelcey', 'Event Planning', 94)";

$insertDataToTable = $conn->query($cronData);

$conn->close();

?>