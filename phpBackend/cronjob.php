<?php

require_once('mysql_connect.php');

$clearTable = "TRUNCATE TABLE students";

$clearTableResult = $conn->query($clearTable);

$cronData = "INSERT INTO `students` (`id`, `name`, `course`, `grade`) VALUES
(25, 'Matthew', 'Finance', 99),
(26, 'Nick', 'Accounting', 91),
(27, 'Anthony', 'Engineering', 95),
(28, 'Abdullah', 'Quantum Computing', 98),
(29, 'Lindsay', 'Satistics', 92),
(30, 'Frank', 'Business', 94),
(31, 'Violet', 'Sociology', 96),
(32, 'Vishak', 'Cyber Security', 97),
(33, 'Dillon', 'Genetics', 98),
(34, 'Nathan', 'Engineering', 94),
(35, 'Jarryd', 'Psychology', 94),
(36, 'Keith', 'Computer Science', 85),
(37, 'Khaleel', 'Web Development', 100),
(38, 'Brenda', 'Earth System Sciences', 99),
(39, 'Aaron', 'Graphic Design', 98),
(40, 'Nick', 'Sociology', 92),
(41, 'Kelcey', 'Event Planning', 94)";

$insertDataToTable = $conn->query($cronData);

$conn->close();

?>