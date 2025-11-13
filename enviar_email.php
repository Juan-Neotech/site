<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

// Set default response header
header('Content-Type: application/json');

try {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
} catch (\Dotenv\Exception\InvalidPathException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erro de configuração do servidor: não foi possível carregar as variáveis de ambiente.']);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = strip_tags(trim($_POST["phone"]));
    $subject = strip_tags(trim($_POST["subject"]));
    $message = trim($_POST["message"]);

    if (empty($name) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Por favor, preencha o formulário e tente novamente.']);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host = $_ENV['SMTP_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['SMTP_USERNAME'];
        $mail->Password = $_ENV['SMTP_PASSWORD'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = $_ENV['SMTP_PORT'];

        //Recipients
        $mail->setFrom($_ENV['SMTP_USERNAME'], 'Contato Site NeoTech');
        $mail->addReplyTo($email);
        $mail->addAddress($_ENV['SMTP_USERNAME'], 'Neo Tech Jundiaí');

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Novo contato do site - ' . $subject;
        $mail->Body    = "<b>Nome:</b> {$name}<br>" .
                         "<b>Email:</b> {$email}<br>" .
                         "<b>Telefone:</b> {$phone}<br>" .
                         "<b>Assunto:</b> {$subject}<br>" .
                         "<b>Mensagem:</b><br>{$message}";
        $mail->AltBody = "Nome: {$name}\n" .
                         "Email: {$email}\n" .
                         "Telefone: {$phone}\n" .
                         "Assunto: {$subject}\n" .
                         "Mensagem:\n{$message}";

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Mensagem enviada com sucesso!']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => "A mensagem não pôde ser enviada. Mailer Error: {$mail->ErrorInfo}"]);
    }
} else {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Houve um problema com o seu envio, por favor, tente novamente.']);
}
?>