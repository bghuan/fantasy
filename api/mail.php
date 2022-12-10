<?php 
header('Access-Control-Allow-Origin:*');
header('Content-type: text/html; charset=utf-8');
// https://blog.csdn.net/xiaolu1014/article/details/108422165

use PHPMailer\PHPMailer\PHPMailer;

include 'vendor/mail/PHPMailer.php';
include 'vendor/mail/SMTP.php';
include 'vendor/mail/Exception.php';
include 'config.php';

function sendMail($to,$title,$content,$Account,$Password,$UserName) {
   $mail = new PHPMailer();
   $mail->isSMTP();                                      
   $mail->SMTPAuth = true;                               
   $mail->Host = 'smtp.163.com';
   $mail->Username = $Account;                 
   $mail->Password = $Password;     
   $mail->SMTPSecure = 'ssl';                            
   $mail->Port = 465;
   $mail->CharSet = 'utf-8';                        
   $mail->setFrom($Account, $UserName);
   $mail->addAddress($to);
   $mail->isHTML(true);
   $mail->Subject = $title;
   $mail->Body = $content;
   if(!$mail->send()) {
     echo 'Mailer Error: ' . $mail->ErrorInfo;
   } else {
     echo "发送成功";
   }
};
$to="bu@bghuan.cn";
$random = mt_rand(100000,999999);
$redis->set($to,$random,600);

$title=$random." 是你注册验证码";
$content="验证码: ".$random." 有效期10分钟\r\n收集幻想\r\nbghuan.cn";

sendMail($to,$title,$content,$emailAccount,$emailPassword,$emailUserName);