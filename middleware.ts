export { default } from "next-auth/middleware";

export const config = {

  matcher: [
    "/bookings",
    "/reservations",
    "/properties",
    "/account-settings",
    "/profile",
    "/messages",
    "/billing",
    "/payment-success",
    "/subscribe",
    "/admin-approvals"
  ]

};

