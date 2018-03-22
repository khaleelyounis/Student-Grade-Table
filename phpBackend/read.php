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
        $output['success'] = true;
    } else {
        $output['error'][] = 'No data available';
        $output['success'] = true;
    }
} else {
    $output['error'][] = 'There was an error, please try again.';
}

?>