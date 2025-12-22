type BasicUserInfo = {
  name?: string;
};

type EventInfo = {
  title: string;
  date?: string;
  location?: string;
  description?: string;
};

const baseStyles = {
  wrapper:
    "font-family: Arial, sans-serif; line-height: 1.6; color: #1f2933; background-color: #f9fafb; padding: 24px;",
  card: "max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 24px 28px; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);",
  title:
    "font-size: 22px; font-weight: 700; color: #14532d; margin-bottom: 12px;",
  subtitle: "font-size: 16px; margin-bottom: 12px;",
  paragraph: "font-size: 14px; margin: 0 0 10px;",
  footer:
    "font-size: 12px; color: #6b7280; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 12px;",
};

const formatName = (name?: string) => name?.trim() || "EcoSphere friend";

export type UserType = "customer" | "organizer" | "shop";

export function getRegistrationSubject(userType: UserType): string {
  switch (userType) {
    case "customer":
      return "Welcome to EcoSphere 🌱";
    case "organizer":
      return "Welcome to EcoSphere - Event Organizer Portal 🎉";
    case "shop":
      return "Welcome to EcoSphere - Shop Partner Portal 🏪";
    default:
      return "Welcome to EcoSphere 🌱";
  }
}

export function customerWelcomeTemplate(user: BasicUserInfo): string {
  const name = formatName(user.name);

  return `
  <div style="${baseStyles.wrapper}">
    <div style="${baseStyles.card}">
      <h2 style="${baseStyles.title}">Welcome to EcoSphere, ${name}! 🌍</h2>
      <p style="${baseStyles.subtitle}">We're excited to have you in our eco‑friendly community!</p>
      <p style="${baseStyles.paragraph}">
        From now on, you can discover sustainable shops, join green events,
        track your impact, and learn more about living consciously with
        EcoSphere.
      </p>
      <p style="${baseStyles.paragraph}">
        Start exploring the platform and see how small actions can create a
        big change. Browse eco-friendly products, participate in environmental
        events, and earn points as you make sustainable choices!
      </p>
      <p style="${baseStyles.paragraph}">See you inside,</p>
      <p style="${baseStyles.paragraph}"><strong>The EcoSphere Team</strong></p>
      <div style="${baseStyles.footer}">
        You received this email because you created a customer account on EcoSphere.
      </div>
    </div>
  </div>
  `;
}

export function organizerWelcomeTemplate(user: BasicUserInfo): string {
  const name = formatName(user.name);

  return `
  <div style="${baseStyles.wrapper}">
    <div style="${baseStyles.card}">
      <h2 style="${baseStyles.title}">Welcome to EcoSphere, ${name}! 🎉</h2>
      <p style="${baseStyles.subtitle}">Thank you for joining as an Event Organizer!</p>
      <p style="${baseStyles.paragraph}">
        As an event organizer, you can now create and manage environmental events,
        reach eco-conscious audiences, and make a positive impact in your community.
      </p>
      <p style="${baseStyles.paragraph}">
        Get started by creating your first event, setting up event details,
        managing attendees, and promoting sustainability through engaging activities.
      </p>
      <p style="${baseStyles.paragraph}">
        We're here to support you every step of the way. If you need help,
        don't hesitate to reach out!
      </p>
      <p style="${baseStyles.paragraph}">Let's create change together,</p>
      <p style="${baseStyles.paragraph}"><strong>The EcoSphere Team</strong></p>
      <div style="${baseStyles.footer}">
        You received this email because you created an Event Organizer account on EcoSphere.
      </div>
    </div>
  </div>
  `;
}

export function shopWelcomeTemplate(user: BasicUserInfo): string {
  const name = formatName(user.name);

  return `
  <div style="${baseStyles.wrapper}">
    <div style="${baseStyles.card}">
      <h2 style="${baseStyles.title}">Welcome to EcoSphere, ${name}! 🏪</h2>
      <p style="${baseStyles.subtitle}">Thank you for joining as a Shop Partner!</p>
      <p style="${baseStyles.paragraph}">
        As a shop partner, you can now showcase your sustainable products,
        connect with eco-conscious customers, and grow your business while
        making a positive environmental impact.
      </p>
      <p style="${baseStyles.paragraph}">
        Get started by setting up your shop profile, adding your products,
        managing inventory, and reaching customers who value sustainability.
      </p>
      <p style="${baseStyles.paragraph}">
        We're committed to helping you succeed. Our platform provides tools
        to manage your shop, track sales, and engage with the EcoSphere community.
      </p>
      <p style="${baseStyles.paragraph}">Welcome aboard,</p>
      <p style="${baseStyles.paragraph}"><strong>The EcoSphere Team</strong></p>
      <div style="${baseStyles.footer}">
        You received this email because you created a Shop Partner account on EcoSphere.
      </div>
    </div>
  </div>
  `;
}

export function getRegistrationTemplate(
  userType: UserType,
  user: BasicUserInfo
): string {
  switch (userType) {
    case "customer":
      return customerWelcomeTemplate(user);
    case "organizer":
      return organizerWelcomeTemplate(user);
    case "shop":
      return shopWelcomeTemplate(user);
    default:
      return customerWelcomeTemplate(user);
  }
}

// Legacy function for backward compatibility
export const registrationSubject = "Welcome to EcoSphere 🌱";

export function registrationTemplate(user: BasicUserInfo): string {
  return customerWelcomeTemplate(user);
}

export function newEventSubject(event: Partial<EventInfo>): string {
  return `New event: ${event.title} 🌿`;
}

export function newEventTemplate(
  user: BasicUserInfo,
  event: EventInfo
): string {
  const name = formatName(user.name);

  const datePart = event.date
    ? `<p style="${baseStyles.paragraph}"><strong>Date:</strong> ${event.date}</p>`
    : "";
  const locationPart = event.location
    ? `<p style="${baseStyles.paragraph}"><strong>Location:</strong> ${event.location}</p>`
    : "";
  const descriptionPart = event.description
    ? `<p style="${baseStyles.paragraph}"><strong>About the event:</strong> ${event.description}</p>`
    : "";

  return `
  <div style="${baseStyles.wrapper}">
    <div style="${baseStyles.card}">
      <h2 style="${baseStyles.title}">A new eco‑event just went live, ${name}!</h2>
      <p style="${baseStyles.subtitle}">Here are the details of the new event you might be interested in:</p>
      <p style="${baseStyles.paragraph}"><strong>Event:</strong> ${event.title}</p>
      ${datePart}
      ${locationPart}
      ${descriptionPart}
      <p style="${baseStyles.paragraph}">
        Log in to EcoSphere to learn more, save the event, or share it with
        your friends.
      </p>
      <p style="${baseStyles.paragraph}">Stay green,</p>
      <p style="${baseStyles.paragraph}"><strong>The EcoSphere Team</strong></p>
      <div style="${baseStyles.footer}">
        You received this email because you're subscribed to EcoSphere event
        updates.
      </div>
    </div>
  </div>
  `;
}

export const redeemCouponTemplate = (
  code: string,
  validTo: Date,
  rate: number,
  name: string = "EcoSphere friend"
): string => {
  return `
    <div style="${baseStyles.wrapper}">
      <div style="${baseStyles.card}">
        <h2 style="${baseStyles.title}">
          Your EcoSphere Reward is Ready! 🎁
        </h2>

        <p style="${baseStyles.paragraph}">
          Hi <strong>${name}</strong>, thank you for being an active EcoSphere member!
        </p>

        <p style="${baseStyles.paragraph}">
          You've successfully redeemed your points and unlocked a special reward.
          Here is your <strong>exclusive 6-digit coupon code</strong>:
        </p>

        <h1 style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          text-align: center;
          color: #14532d;
          margin: 20px 0;
        ">
          ${code}
        </h1>

        <p style="${baseStyles.paragraph}">
          This coupon gives you a <strong>${rate}% discount</strong> on purchases
          above <strong>200 EGP</strong>, with a maximum discount of
          <strong>up to 50 EGP</strong>.
        </p>

        <p style="${baseStyles.paragraph}">
          The code is <strong>unique to you</strong> and can be used
          <strong>only once</strong>. No one else can use it.
        </p>

        <p style="${baseStyles.paragraph}">
          You can use this coupon in our <strong>online store</strong>
          or at any <strong>EcoSphere partner shop</strong>.
        </p>

        <p style="${baseStyles.paragraph}">
          Please make sure to use it before
          <strong>${validTo.toDateString()}</strong>.
        </p>

        <div style="${baseStyles.footer}">
          You received this email because you redeemed your EcoSphere points.
        </div>
      </div>
    </div>
  `;
};

export const forgetPasswordTemplate = (
  code: string,
  validTo: string,
  name: string = "EcoSphere friend"
): string => {
  return `
    <div style="${baseStyles.wrapper}">
      <div style="${baseStyles.card}">
        <h2 style="${baseStyles.title}">
          Password Reset Request 🔒
        </h2>
        <p style="${baseStyles.paragraph}">
          Hi <strong>${name}</strong>,
        </p>
        <p style="${baseStyles.paragraph}">
          We received a request to reset your EcoSphere account password.
          Use the secure code below to proceed with resetting your password:
        </p>
        <h1 style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          text-align: center;
          color: #14532d;
          margin: 20px 0;
        ">
          ${code}
        </h1>
        <p style="${baseStyles.paragraph}">
          This code is valid until <strong>for the next 15 minutes</strong>.
          Please do not share this code with anyone.
        </p>
        <p style="${baseStyles.paragraph}">
          If you did not request a password reset, please ignore this email.
        </p>
        <p style="${baseStyles.paragraph}">
          Stay safe,
        </p>
        <p style="${baseStyles.paragraph}">
          <strong>The EcoSphere Team</strong>
        </p>
        <div style="${baseStyles.footer}">
          You received this email because you requested a password reset for your EcoSphere account.
        </div>
      </div>
    </div>
  `;
};
