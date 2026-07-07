import nodemailer from "nodemailer";

// Built lazily so env vars are read at send time, not module-load time.
// (The Temporal worker loads .env after imports resolve, so eager creation
// would capture undefined credentials → "Missing credentials for PLAIN".)
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
  return transporter;
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    ...options,
  });
}
