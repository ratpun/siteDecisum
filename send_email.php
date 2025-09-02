<?php
// Verifique se o formulário foi enviado usando o método POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Sanitize e obtenha os dados do formulário
    $name = strip_tags(trim($_POST["name"]));
    $name = str_replace(array("\r","\n"),array(" "," "),$name);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = strip_tags(trim($_POST["phone"]));
    $units = filter_var(trim($_POST["units"]), FILTER_SANITIZE_NUMBER_INT);
    $message = trim($_POST["message"]);

    // Validação dos dados
    if ( empty($name) OR empty($phone) OR empty($units) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Define um código de resposta 400 (requisição inválida)
        http_response_code(400);
        echo "Por favor, preencha todos os campos do formulário.";
        exit;
    }

    // Defina o e-mail do destinatário AQUI
    $recipient = "allaskaraff@gmail.com";

    // Crie o assunto do e-mail
    $subject = "Novo Pedido de Orçamento de $name";

    // Construa o corpo do e-mail
    $email_content = "Nome: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Telefone: $phone\n";
    $email_content .= "Quantidade de Unidades: $units\n\n";
    $email_content .= "Mensagem:\n$message\n";

    // Construa os cabeçalhos do e-mail
    $email_headers = "From: $name <$email>";

    // Envie o e-mail
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        // Define um código de resposta 200 (OK)
        http_response_code(200);
        echo "Obrigado! Sua mensagem foi enviada com sucesso.";
    } else {
        // Define um código de resposta 500 (erro interno do servidor)
        http_response_code(500);
        echo "Oops! Algo deu errado e não conseguimos enviar sua mensagem.";
    }

} else {
    // Se não for uma requisição POST, define um código 403 (proibido)
    http_response_code(403);
    echo "Houve um problema com o seu envio, por favor, tente novamente.";
}
?>