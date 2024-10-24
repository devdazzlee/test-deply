import nodemailer, { Transporter } from "nodemailer";
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
            "Welcome to Shutter Guide",

            `<section style="max-width: 640px; padding: 24px 48px; margin: 0 auto; background-color: #ffffff; color: #1f2937;">
        <main style="margin-top: 32px;">
            <h2 style="color: #374151;">Hi ${this.name}</h2>
            <p style="margin-top: 8px; line-height: 1.75; color: #4b5563;">
                Verify your account to get started on <span style="font-weight: 600;">Shutter Guide</span>.
            </p>
            <a style="padding: 8px 24px; margin-top: 16px; font-size: 0.875rem; font-weight: 500; color: #ffffff; background-color: #202125; border-radius: 0.375rem; text-decoration: none; display: inline-block;" href="${process.env.NEXT_PUBLIC_BASE_URL}/api/verify/${token}">
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

    async sendNewListing(): Promise<void> {
        await this.send(
            "Your listing is under review!",
            `<section style="max-width: 640px; padding: 24px 48px; margin: 0 auto; background-color: #ffffff; color: #1f2937;">
        <main style="margin-top: 32px;">
            <h2 style="color: #374151;">Hi ${this.name}</h2>
            <p style="margin-top: 8px; line-height: 1.75; color: #4b5563;">
                Your new creation is under review. We will inform you if it gets <b>approved</b> or <b>rejected</b>.
            
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
    async sendListingStatus(status: boolean): Promise<void> {
        status === true ?
            await this.send(
                `Congratulations! Your listing has been approved!"`,
                `<section style="max-width: 640px; padding: 24px 48px; margin: 0 auto; background-color: #ffffff; color: #1f2937;">
        <main style="margin-top: 32px;">
            <h2 style="color: #374151;">Hi ${this.name}</h2>
            <p style="margin-top: 8px; line-height: 1.75; color: #4b5563;">
                Your new creation has been <b>approved</b>. You can see it on the <span><a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="font-weight: 600;">Shutter Guide</a></span> website.
            
            <p style="margin-top: 32px; color: #4b5563;">
                Thanks, <br>
                Shutter Guide Team
            </p>
        </main>
        <footer style="margin-top: 32px;">
            <p style="margin-top: 12px; color: #9ca3af;">© ${new Date().getFullYear()} Shutter Guide. All Rights Reserved.</p>
        </footer>
    </section>`
            )
            :
            await this.send(
                `We're sorry! Your listing has been rejected!"`,
                `<section style="max-width: 640px; padding: 24px 48px; margin: 0 auto; background-color: #ffffff; color: #1f2937;">
        <main style="margin-top: 32px;">
            <h2 style="color: #374151;">Hi ${this.name}</h2>
            <p style="margin-top: 8px; line-height: 1.75; color: #4b5563;">
                Your new creation has been <b>rejected</b>. It is against our community standards. 
            
            <p style="margin-top: 32px; color: #4b5563;">
                Thanks, <br>
                Shutter Guide Team
            </p>
        </main>
        <footer style="margin-top: 32px;">
            <p style="margin-top: 12px; color: #9ca3af;">© ${new Date().getFullYear()} Shutter Guide. All Rights Reserved.</p>
        </footer>
    </section>`
            )
    }

    async sendNewBooking(): Promise<void> {
        await this.send(
            "Your booking is under review by the creator!",
            `<section style="max-width: 640px; padding: 24px 48px; margin: 0 auto; background-color: #ffffff; color: #1f2937;">
        <main style="margin-top: 32px;">
            <h2 style="color: #374151;">Hi ${this.name}</h2>
            <p style="margin-top: 8px; line-height: 1.75; color: #4b5563;">
                Your new booking is under review. We will inform you if it gets <b>approved</b> or <b>rejected</b> by the creator.
            
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

    async sendBookingStatus(status: boolean): Promise<void> {
        status === true ?
            await this.send(
                `Congratulations! Your new booking has been approved!"`,
                `<section style="max-width: 640px; padding: 24px 48px; margin: 0 auto; background-color: #ffffff; color: #1f2937;">
    <main style="margin-top: 32px;">
        <h2 style="color: #374151;">Hi ${this.name}</h2>
        <p style="margin-top: 8px; line-height: 1.75; color: #4b5563;">
            Your new booking has been <b>approved</b> by the creator. You can see it on the <span><a href="${process.env.NEXT_PUBLIC_BASE_URL}/trips" style="font-weight: 600;">My bookings</a></span>.
        
        <p style="margin-top: 32px; color: #4b5563;">
            Thanks, <br>
            Shutter Guide Team
        </p>
    </main>
    <footer style="margin-top: 32px;">
        <p style="margin-top: 12px; color: #9ca3af;">© ${new Date().getFullYear()} Shutter Guide. All Rights Reserved.</p>
    </footer>
</section>`
            )
            :
            await this.send(
                `We're sorry! Your new booking has been rejected!"`,
                `<section style="max-width: 640px; padding: 24px 48px; margin: 0 auto; background-color: #ffffff; color: #1f2937;">
    <main style="margin-top: 32px;">
        <h2 style="color: #374151;">Hi ${this.name}</h2>
        <p style="margin-top: 8px; line-height: 1.75; color: #4b5563;">
            Your new booking has been <b>rejected</b> by the creator.  
        
        <p style="margin-top: 32px; color: #4b5563;">
            Thanks, <br>
            Shutter Guide Team
        </p>
    </main>
    <footer style="margin-top: 32px;">
        <p style="margin-top: 12px; color: #9ca3af;">© ${new Date().getFullYear()} Shutter Guide. All Rights Reserved.</p>
    </footer>
</section>`
            )
    }

    async sendStripeOnBoarding(): Promise<void> {
        await this.send(
            `Congratulations! Your stripe onboarding has been completed!"`,
            `<section style="max-width: 640px; padding: 24px 48px; margin: 0 auto; background-color: #ffffff; color: #1f2937;">
<main style="margin-top: 32px;">
    <h2 style="color: #374151;">Hi ${this.name}</h2>
    <p style="margin-top: 8px; line-height: 1.75; color: #4b5563;">
        Your stripe onboarding has been <b>completed</b>. You can now see your report on the <span><a href="${process.env.NEXT_PUBLIC_BASE_URL}/billing" style="font-weight: 600;">Billings</a></span>.
    
    <p style="margin-top: 32px; color: #4b5563;">
        Thanks, <br>
        Shutter Guide Team
    </p>
</main>
<footer style="margin-top: 32px;">
    <p style="margin-top: 12px; color: #9ca3af;">© ${new Date().getFullYear()} Shutter Guide. All Rights Reserved.</p>
</footer>
</section>`
        )
    }

    async sendAdminApproval(): Promise<void> {
        await this.send(
            "You have a new listing to review!",
            `<section style="max-width: 640px; padding: 24px 48px; margin: 0 auto; background-color: #ffffff; color: #1f2937;">
        <main style="margin-top: 32px;">
            <h2 style="color: #374151;">Hi ${this.name}</h2>
            <p style="margin-top: 8px; line-height: 1.75; color: #4b5563;">
                You have a new creation to review. Mark it as <b>approved</b> or <b>rejected</b>.
            
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
