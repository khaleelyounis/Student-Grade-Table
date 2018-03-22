<?php

if(empty($localAccess)) {
    die('Direct access is not allowed');
}

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
$course = filter_var($_POST['course'], FILTER_SANITIZE_STRING);
$grade = filter_var($_POST['grade'], FILTER_SANITIZE_NUMBER_INT);
$grade = intval($grade);

$output = [
    'success' => false,
    'data' => [],
    'errors' => []
];

try {
    
    $stmt = mysqli_prepare($conn, "INSERT INTO students SET name = ?, course = ?, grade = ?");

    mysqli_stmt_bind_param($stmt, "sss", $name, $course, $grade);

    mysqli_stmt_execute($stmt);

    $result = mysqli_stmt_fetch($stmt);

    if ( mysqli_affected_rows($conn) > 0 ){
        $new_id = mysqli_insert_id($conn);
        $output['success'] = true;
        $output['id'] = $new_id;
    } else {
        $output['errors'][] = 'There was an error, please try again.';
    }

} catch(Exception $e) {
    http_response_code(500);
    echo $e;
}

?>