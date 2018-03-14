<?php

if(empty($localAccess)) {
    die('Direct access is not allowed');
}

print_r($_POST);
$name = $_POST['name'];
$course = $_POST['course'];
$grade = $_POST['grade'];

$output = [
    'success' => false,
    'error' => [],
];

$query = "INSERT INTO students (name, course, grade) VALUES (?,?,?)";

$stmt = $conn->prepare($query);

$stmt->bind_param("sss", $name, $course, $grade);

$stmt->execute();

if (!$stmt) {
    $output['error'][] = 'The prepared statement failed.';
    die('The prepared statement failed to prepare.');
}

$output['success'] = true;

$stmt->close();

?>