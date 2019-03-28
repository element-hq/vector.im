<?php
// Contact Form for vector.im
//
// Copyright 2019 New Vector Ltd
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

$config = include('config.php');

if (!isset($config['forwarding_name'])
    or !isset($config['forwarding_email'])) {
    http_response_code(500);
    echo 'Required config fields: forwarding_name, forwarding_email';
    die();
}


// Ensure all required fields are sent
if (!isset($_POST['name'])
        or !isset($_POST['email'])
        or !isset($_POST['enquiry'])) {
    http_response_code(400);
    echo 'Required POST fields: name, email, enquiry';
    die("name: " . $_POST['name'] . ", email: " . $_POST['email'] . ", enquiry: " . $_POST['enquiry']);
}

$to_name    = $config['forwarding_name'];
$to_email   = $config['forwarding_email'];
$from_email = $_POST['email'];
$from_name  = $_POST['name'];
$enquiry    = $_POST['enquiry'];

// Set up email headers in the form of:
// Sender: contact@example.com
// From: John Doe via vector.im <john@doe.com>
// Reply-To: John Doe <john@doe.com>
// To: CoolCorp Contact <contact@example.com>
$headers = "Sender: " . $to_email . "\r\n" .
           "From: " . $from_name . " via vector.im " . "<" . $from_email . ">\r\n" .
           "Reply-To: " . $from_name . " <" . $from_email . ">\r\n" .
           "To: " . $to_name . " <" . $to_email . ">";

// Subject is in the form of:
// Contact form submission from Andrew M (andrewm@matrix.org)
$subject = 'Contact form submission from ' . $from_name . ' (' . $from_email . ')';

// Send the email
$success = mail($to_email, $subject, $enquiry, $headers);
if (!$success) {
    $errorMessage = error_get_last()['message'];
    echo $errorMessage;
    die();
}

// Success
http_response_code(200);
die('success');
?>
