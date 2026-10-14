<?php
// Headers to return JSON response
header('Content-Type: application/json');

// Email configuration
$recipient_email = "ceomeriise@mcehassan.ac.in";
$sender_name = "ME-RIISE Foundation";

// Check if request is POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    http_response_code(405);
    exit;
}

// Get and sanitize form data
$name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? htmlspecialchars(trim($_POST['email'])) : '';
$program = isset($_POST['program']) ? htmlspecialchars(trim($_POST['program'])) : '';
$message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

// Validate required fields
if (empty($name) || empty($email) || empty($program) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    http_response_code(400);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    http_response_code(400);
    exit;
}

// Prepare email for recipient
$admin_subject = "New Contact Form Submission - ME-RIISE Foundation";
$admin_body = "You have received a new message from the Contact Us form.\n\n";
$admin_body .= "========================================\n";
$admin_body .= "SENDER INFORMATION\n";
$admin_body .= "========================================\n";
$admin_body .= "Full Name: " . $name . "\n";
$admin_body .= "Email Address: " . $email . "\n";
$admin_body .= "Program Interest: " . $program . "\n";
$admin_body .= "========================================\n\n";
$admin_body .= "MESSAGE:\n";
$admin_body .= "========================================\n";
$admin_body .= $message . "\n\n";
$admin_body .= "========================================\n";
$admin_body .= "Submitted on: " . date('Y-m-d H:i:s') . "\n";
$admin_body .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
$admin_body .= "========================================\n\n";
$admin_body .= "Reply directly to this email or use: " . $email . "\n";
$admin_body .= "---\n";
$admin_body .= "This is an automated message from your website contact form.";

// Prepare headers for admin email
// Send FROM an @meriise.org address (the hosting domain) so Hostinger's SPF
// authorizes it; Reply-To stays the enquirer so the CEO can reply directly.
$admin_headers = "From: ME-RIISE Foundation <noreply@meriise.org>\r\n";
$admin_headers .= "Reply-To: " . $email . "\r\n";
$admin_headers .= "MIME-Version: 1.0\r\n";
$admin_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$admin_headers .= "X-Mailer: ME-RIISE Foundation Contact Form\r\n";

// Prepare confirmation email for user
$user_subject = "We received your message - ME-RIISE Foundation";
$user_body = "Dear " . $name . ",\n\n";
$user_body .= "Thank you for contacting ME-RIISE Foundation. We have received your message and will review it.\n";
$user_body .= "Our team will get back to you within 24 hours.\n\n";
$user_body .= "========================================\n";
$user_body .= "YOUR SUBMISSION DETAILS\n";
$user_body .= "========================================\n";
$user_body .= "Full Name: " . $name . "\n";
$user_body .= "Email: " . $email . "\n";
$user_body .= "Program Interest: " . $program . "\n";
$user_body .= "Submitted on: " . date('Y-m-d H:i:s') . "\n";
$user_body .= "========================================\n\n";
$user_body .= "YOUR MESSAGE:\n";
$user_body .= $message . "\n\n";
$user_body .= "========================================\n\n";
$user_body .= "If you have any questions, feel free to reach out:\n\n";
$user_body .= "ME-RIISE Foundation\n";
$user_body .= "Malnad College of Engineering, Hassan\n";
$user_body .= "Email: ceomeriise@mcehassan.ac.in\n";
$user_body .= "Phone: +91-9448179074\n";
$user_body .= "Available: Mon-Fri, 9 AM - 5 PM\n\n";
$user_body .= "Best regards,\n";
$user_body .= "ME-RIISE Foundation Team";

// Prepare headers for user email
$user_headers = "From: ME-RIISE Foundation <noreply@meriise.org>\r\n";
$user_headers .= "MIME-Version: 1.0\r\n";
$user_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$user_headers .= "X-Mailer: ME-RIISE Foundation Contact Form\r\n";

// Send emails
// "-f" sets the SPF envelope sender so mail passes on Hostinger
$admin_sent = @mail($recipient_email, $admin_subject, $admin_body, $admin_headers, "-f noreply@meriise.org");
$user_sent = @mail($email, $user_subject, $user_body, $user_headers, "-f noreply@meriise.org");

// Save submission to file as backup
$submissions_dir = __DIR__ . '/submissions';
if (!is_dir($submissions_dir)) {
    @mkdir($submissions_dir, 0755, true);
}

$submission_data = [
    'timestamp' => date('Y-m-d H:i:s'),
    'name' => $name,
    'email' => $email,
    'program' => $program,
    'message' => $message,
    'ip_address' => $_SERVER['REMOTE_ADDR'],
    'user_agent' => isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Unknown'
];

$filename = $submissions_dir . '/submission_' . date('Y-m-d_H-i-s') . '_' . uniqid() . '.json';
@file_put_contents($filename, json_encode($submission_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

// Return response
if ($admin_sent || $user_sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully! We will contact you soon.'
    ]);
    http_response_code(200);
} else {
    echo json_encode([
        'success' => true,
        'message' => 'Message received! We will contact you soon.'
    ]);
    http_response_code(200);
}

exit;
?>
