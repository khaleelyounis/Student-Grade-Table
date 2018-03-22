<?php 

require_once('mysql_connect.php');

$localAccess = true;

if(!$_POST['action']) {
    $output['error'][] = 'No action specified.';
    $json_output = json_encode($output);
    print($json_output);
    exit();
}

switch($_POST['action']) {
    case 'read':
        include('read.php');
        break;
    case 'create':
        include('create.php');
        break;
    case 'delete':
        include('delete.php');
        break;
    default:
        $output['errors'][] = 'invalid action';
}

$json_output = json_encode($output);

print($json_output);

?>