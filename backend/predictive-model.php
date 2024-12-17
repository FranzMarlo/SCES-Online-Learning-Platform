<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

function classify_remarks($success_rate) {
    if ($success_rate >= 90) {
        return "Outstanding";
    } elseif ($success_rate >= 85 && $success_rate < 90) {
        return "Very Satisfactory";
    } elseif ($success_rate >= 80 && $success_rate < 85) {
        return "Satisfactory";
    } elseif ($success_rate >= 75 && $success_rate < 80) {
        return "Fairly Satisfactory";
    } else {
        return "Did Not Meet Expectations";
    }
}

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    echo json_encode(['message' => 'CORS preflight check passed']);
    exit;
}

// Check if POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method']);
    http_response_code(405);
    exit;
}

// Get JSON input data
$data = json_decode(file_get_contents("php://input"), true);
$gwa_records = $data['gwa_records'] ?? [];

if (empty($gwa_records)) {
    echo json_encode(["error" => "No GWA records provided."]);
    http_response_code(400);
    exit;
}

// Extract GWA values from records
$gwa_values = array_column($gwa_records, 'gwa');
$recent_gwa = end($gwa_values);
$cumulative_gwa = array_sum($gwa_values) / count($gwa_values);
$gwa_trend = $recent_gwa - $gwa_values[0];

// Graduation prediction based on most recent GWA
$predicted_grad_rate = ($recent_gwa >= 80) ? "Passed" : "At Risk";

// Calculate adjusted success rate
$trend_adjustment = $gwa_trend * 0.1;  // Small adjustment based on trend (10%)
$predicted_success_rate = round($cumulative_gwa + $trend_adjustment, 2);

// Predict next GWA based on recent trend
$predicted_next_gwa = round($recent_gwa + $trend_adjustment, 1);

// Remarks classification based on success rate
$predicted_remarks = classify_remarks($predicted_next_gwa);

$response = [
    'predicted_performance' => $predicted_grad_rate,
    'predicted_academic_success_rate' => $predicted_success_rate,
    'predicted_remarks' => $predicted_remarks,
    'predicted_next_gwa' => $predicted_next_gwa
];

echo json_encode($response);
?>
