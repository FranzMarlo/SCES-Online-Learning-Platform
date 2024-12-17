<?php
session_start();
include $_SERVER['DOCUMENT_ROOT'] . '/backend/global.php';


if (isset($_SESSION['admin_id'])) {
    $admin = new adminLoggedIn();
    $admin->needLogout();
} else if (isset($_SESSION['faculty_id'])) {
    $faculty = new facultyLoggedIn();
    $faculty->needLogout();
} else {
    $student = new loggedIn();
    $student->needLogout();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/assets/style/style.css" />
    <link rel="icon" href="/assets/images/favicon.ico" />