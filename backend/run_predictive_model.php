<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Capture the input data from JavaScript
$inputData = json_decode(file_get_contents('php://input'), true);

if (isset($inputData['gwa_records'])) {
    $gwaRecords = json_encode($inputData['gwa_records']);

    // Command to run the Python script
    $command = escapeshellcmd("python3 /home/u540688077/public_html/backend/predictive-model.py '$gwaRecords'");

    // Execute the Python script and capture the output using exec
    exec($command, $output, $status);

    // Check for any error
    if ($status !== 0) {
        echo json_encode(["error" => "Python script execution failed."]);
        exit;
    }

    // Return the output (predictions) as a JSON response
    echo implode("\n", $output);
} else {
    echo json_encode(["error" => "No GWA records provided."]);
}
?>
