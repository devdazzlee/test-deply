export { default } from "next-auth/middleware";

export const config = {

  matcher: [
    "/bookings",
    "/reservations",
    "/properties",
    "/account-settings",
    "/faq",
    "/terms-and-conditions",
    "/profile",
    "/messages",
    "/billing",
    "/payment-success",
    "/subscribe",
  ]

};

