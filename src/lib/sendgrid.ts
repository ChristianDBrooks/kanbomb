import sgMail from '@sendgrid/mail';

export async function sendMagicLinkEmail(email: string, link: string) {
  const sender = process.env.SENDGRID_VERIFIED_SENDER!;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
  const msg = {
    to: email, // Recipient
    from: sender, // Sender
    subject: 'KanBomb Sign In Link', // Subject
    html: `<p>Sign in from anywhere by clicking the magic link below!</p><a href="${link}">Sign In</a>`, // Email Content
  }
  if (!process.env.SEND_EMAILS) return;
  await sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

export async function sendVerificationEmail(email: string, link: string) {
  const sender = process.env.SENDGRID_VERIFIED_SENDER!;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
  const msg = {
    to: email, // Recipient
    from: sender, // Sender
    subject: 'KanBomb Account Verification', // Subject
    html: `<p>Your email ${email}, was used to create an account at ${process.env.EMAIL_REDIRECT_URI}. Verify your account by clicking the link below.</p><p>If you did not create this account, ignore this message.</p><a href="${link}">Verify Account</a>`, // Email Content
  }
  if (!process.env.SEND_EMAILS) return;
  await sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}