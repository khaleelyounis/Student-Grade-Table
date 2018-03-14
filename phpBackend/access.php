<?php 

require_once('mysql_connect.php');

$localAccess = true;

$output = [
    'success' => false,
    'error' => [],
];

if(!$_POST['action']) {
    console.log('$_POST ', $_POST);
    $output['errors'][] = 'No action specified.';
    print(json_encode($output));
    exit();
}

switch($_POST['action']) {
    case 'read':
        include('read.php');
        break;
    case 'create':
        include('create.php');
        break;
    default:
        $output['errors'][] = 'invalid action';
}

$json_output = json_encode($output);

print($json_output);

?>