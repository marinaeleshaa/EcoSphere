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
  card:
    "max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 24px 28px; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);",
  title: "font-size: 22px; font-weight: 700; color: #14532d; margin-bottom: 12px;",
  subtitle: "font-size: 16px; margin-bottom: 12px;",
  paragraph: "font-size: 14px; margin: 0 0 10px;",
  footer:
    "font-size: 12px; color: #6b7280; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 12px;",
};

const formatName = (name?: string) => name?.trim() || "EcoSphere friend";

export const registrationSubject = "Welcome to EcoSphere 🌱";

export function registrationTemplate(user: BasicUserInfo): string {
  const name = formatName(user.name);

  return `
  <div style="${baseStyles.wrapper}">
    <div style="${baseStyles.card}">
      <h2 style="${baseStyles.title}">Welcome to EcoSphere, ${name}!</h2>
      <p style="${baseStyles.subtitle}">We\'re excited to have you in our eco‑friendly community. 🌍</p>
      <p style="${baseStyles.paragraph}">
        From now on, you can discover sustainable shops, join green events,
        track your impact, and learn more about living consciously with
        EcoSphere.
      </p>
      <p style="${baseStyles.paragraph}">
        Start exploring the platform and see how small actions can create a
        big change.
      </p>
      <p style="${baseStyles.paragraph}">See you inside,</p>
      <p style="${baseStyles.paragraph}"><strong>The EcoSphere Team</strong></p>
      <div style="${baseStyles.footer}">
        You received this email because you created an account on EcoSphere.
      </div>
    </div>
  </div>
  `;
}

export function newEventSubject(event: Partial<EventInfo>): string {
  return `New event: ${event.title} 🌿`;
}

export function newEventTemplate(user: BasicUserInfo, event: EventInfo): string {
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
        You received this email because you\'re subscribed to EcoSphere event
        updates.
      </div>
    </div>
  </div>
  `;
}
