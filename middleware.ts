export { default } from "next-auth/middleware";

export const config = {

  matcher: [
    "/bookings", 
    "/reservations", 
    "/properties", 
    "/favorites", 
    "/profile", 
    "/messages", 
    "/billing", 
    "/payment-success",  
    "/subscribe",
  ]

};

