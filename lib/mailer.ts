import nodemailer from 'nodemailer';

type MailPayload = { to: string; subject: string; text: string };

export async function sendMail(payload: MailPayload) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log(`[MAIL-DRYRUN] To:${payload.to} Subject:${payload.subject} -> ${payload.text}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  await transporter.sendMail({
    from: SMTP_FROM || 'no-reply@preconadmin.app',
    to: payload.to,
    subject: payload.subject,
    text: payload.text
  });
}
