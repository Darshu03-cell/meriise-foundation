<?php
// Email configuration
$recipient_email = "ceomeriise@mcehassan.ac.in";
$messages_file = __DIR__ . '/contact_messages.json';

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email = htmlspecialchars(trim($_POST['email'] ?? ''));
    $program_interest = htmlspecialchars(trim($_POST['program_interest'] ?? ''));
    $message = htmlspecialchars(trim($_POST['message'] ?? ''));

    // Validate form data
    if (empty($name) || empty($email) || empty($program_interest) || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        http_response_code(400);
        exit;
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
        http_response_code(400);
        exit;
    }

    // Save message to file
    $submission = [
        'timestamp' => date('Y-m-d H:i:s'),
        'name' => $name,
        'email' => $email,
        'program_interest' => $program_interest,
        'message' => $message,
        'ip_address' => $_SERVER['REMOTE_ADDR']
    ];

    // Read existing messages
    $messages = [];
    if (file_exists($messages_file)) {
        $json_content = file_get_contents($messages_file);
        if ($json_content) {
            $messages = json_decode($json_content, true) ?? [];
        }
    }

    // Add new message
    $messages[] = $submission;

    // Write back to file
    if (file_put_contents($messages_file, json_encode($messages, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES))) {
        // Try to send email using mail function (if available on server)
        $subject = "New Contact Form Submission from ME-RIISE Foundation";
        $email_body = "You have received a new message from the Contact Us form.\n\n";
        $email_body .= "Full Name: " . $name . "\n";
        $email_body .= "Email Address: " . $email . "\n";
        $email_body .= "Program Interest: " . $program_interest . "\n";
        $email_body .= "Message:\n" . $message . "\n\n";
        $email_body .= "---\n";
        $email_body .= "Submitted on: " . date('Y-m-d H:i:s') . "\n";
        $email_body .= "IP Address: " . $_SERVER['REMOTE_ADDR'];

        // Send FROM an @meriise.org address (the hosting domain) so Hostinger's
        // SPF authorizes it; Reply-To stays the enquirer so the CEO can reply directly.
        $headers = "From: ME-RIISE Foundation <noreply@meriise.org>\r\n";
        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        // Attempt to send email ("-f" sets the SPF envelope sender)
        @mail($recipient_email, $subject, $email_body, $headers, "-f noreply@meriise.org");

        // Send confirmation email to user
        $user_subject = "We received your message - ME-RIISE Foundation";
        $user_body = "Dear " . $name . ",\n\n";
        $user_body .= "Thank you for contacting ME-RIISE Foundation. We have received your message and will get back to you soon.\n\n";
        $user_body .= "Program Interest: " . $program_interest . "\n\n";
        $user_body .= "Best regards,\n";
        $user_body .= "ME-RIISE Foundation Team\n";
        $user_body .= "Email: ceomeriise@mcehassan.ac.in\n";
        $user_body .= "Phone: +91 9448179074";

        $user_headers = "From: ME-RIISE Foundation <noreply@meriise.org>\r\n";
        $user_headers .= "MIME-Version: 1.0\r\n";
        $user_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        @mail($email, $user_subject, $user_body, $user_headers, "-f noreply@meriise.org");

        // Return success response
        echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
        http_response_code(200);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save message.']);
        http_response_code(500);
    }
} else {
    // If not a POST request, return error
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    http_response_code(405);
}
?>
