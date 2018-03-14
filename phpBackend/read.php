<?php

if(empty($localAccess)) {
    die('Direct access is not allowed');
}

$query = "SELECT * FROM students";

$result = mysqli_query($conn, $query);

$output = [
    'success' => false,
    'error' => [],
    'data' => []
];

if(!empty($result)){
    if(mysqli_num_rows($result) !== 0) {
        $output['success'] = true;
        while( $row = mysqli_fetch_assoc($result)) {
            $output['data'][] = $row;
        }
    } else {
        $output['errors'][] = 'No data available';
    }
} else {
    $output['errors'][] = mysqli_error($conn);
}

?>