export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/class-room/:path*"],
};
