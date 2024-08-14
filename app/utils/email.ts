import nodemailer, { Transporter } from "nodemailer";
import Logo from "../components/navbar/Logo";
interface User {
    email: string;
    name: string;
}

class Email {
    private to: string;
    private from: string | undefined;
    private name: string;

    constructor(user: User) {
        this.to = user.email;
        this.from = process.env.MAIL_SENDER;
        this.name = user.name;
    }

    private newTransport(): Transporter {
        return nodemailer.createTransport({
            service: process.env.MAIL_SERVICE,
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    private async send(subject: string, template: string): Promise<void> {
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html: template,
        };
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome(token: string): Promise<void> {


        await this.send(
            "Welcome :)",

            `<section style="max-width: 640px; padding: 24px 48px; margin: 0 auto; background-color: #ffffff; color: #1f2937;">
        <main style="margin-top: 32px;">
            <h2 style="color: #374151;">Hi ${this.name}</h2>
            <p style="margin-top: 8px; line-height: 1.75; color: #4b5563;">
                Verify your account to get started on <span style="font-weight: 600;">Shutter Guide</span>.
            </p>
            <a style="padding: 8px 24px; margin-top: 16px; font-size: 0.875rem; font-weight: 500; color: #ffffff; background-color: #202125; border-radius: 0.375rem; text-decoration: none; display: inline-block;" href="${process.env.NEXT_PUBLIC_SITE_URL}/api/verify/${token}">
                Verify Account
            </a>
            <p style="margin-top: 32px; color: #4b5563;">
                Thanks, <br>
                Shutter Guide Team
            </p>
        </main>
        <footer style="margin-top: 32px;">
            <p style="margin-top: 12px; color: #9ca3af;">© ${new Date().getFullYear()} Shutter Guide. All Rights Reserved.</p>
        </footer>
    </section>`
        );
    }

    async sendResetPassword(resetUrl: string): Promise<void> {
        await this.send(
            "Password Reset",
            `<h1>
        Forgot your password? Submit a 
        patch request with your new password 
        and passwordConfirm to <a href='${resetUrl}'>${resetUrl}</a>.
        If you didn't forget your password just ignore this message.
      </h1>`
        );
    }
}

export default Email;
