import sgMail from '@sendgrid/mail';

export async function sendMagicLinkEmail(email:string, link: string) {
  const sender = 'support@duotech.us';
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
  const msg = {
    to: email, 
    from: sender, // Change to your verified sender
    subject: 'NextJS Starter Sign In Link',
    html: `<p>Sign in from anywhere by clicking the magic link below!</p><a href="${link}">Sign In</a>`,
  }
  await sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}