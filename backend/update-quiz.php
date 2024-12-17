<?php
include 'fetch-db.php';
$updateDb = new fetchClass();

$currentDateTime = date('Y-m-d H:i:s');

$updateDb->updateQuizzes($currentDateTime);