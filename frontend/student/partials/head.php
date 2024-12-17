<?php
session_start();

// Prevent caching of the login page
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

// If the user is already logged in, redirect them to the dashboard
if (isset($_SESSION['student_id'])) {
    header("Location: /frontend/student/dashboard.php");
    exit();
}
include $_SERVER['DOCUMENT_ROOT'] . '/backend/global.php';

$log = new loggedIn();
$log->needLogout(); 
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/assets/style/style.css" />
    <link rel="stylesheet" href="/assets/font-awesome/css/all.css">
    <link rel="icon" href="/assets/images/favicon.ico" />
    

    