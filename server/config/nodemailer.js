import nodemailer from 'nodemailer'; // for sending the confirmation emails 

const transporter = nodemailer.createTransport(    // Create a transporter object using the default SMTP transport
    {
        host: 'smtp-relay.brevo.com', // SMTP server host
        port: 587, // SMTP server port
        secure: false, // true for 465, false for other ports
        auth :{
            user: process.env.SMTP_USER, // SMTP user from environment variables
            pass: process.env.SMTP_PASSWORD // SMTP password from environment variables
        },
        // Additional options for better deliverability
        tls: {
            rejectUnauthorized: false
        },
        // Connection timeout
        connectionTimeout: 60000,
        greetingTimeout: 30000,
        socketTimeout: 60000
    }
)

// Email configuration for professional branding
export const EMAIL_CONFIG = {
    from: {
        name: 'Hostel Finder',
        address: process.env.SENDER_EMAIL || 'noreply@hostelfinder.com'
    },
    replyTo: process.env.REPLY_TO_EMAIL || 'support@hostelfinder.com',
    company: {
        name: 'Hostel Finder',
        website: process.env.WEBSITE_URL || 'https://hostelfinder.com',
        supportEmail: 'support@hostelfinder.com',
        logo: process.env.LOGO_URL || 'https://your-domain.com/logo1.png', // Your Hostel Finder logo
        adminEmail: process.env.ADMIN_EMAIL || 'admin@hostelfinder.com', // Admin email for notifications
        adminPanelUrl: process.env.ADMIN_PANEL_URL || 'https://your-domain.com/admin/properties' // Admin panel URL
    }
}

export default transporter;