"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

import Navbar from "@/components/ui/navbar";
// Use State

function Layout({ children }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <h1>loading...</h1>;
  }

  //   function parseJwt(token) {
  //     if (!token) {
  //       return;
  //     }
  //     const base64Url = token.split(".")[1];
  //     const base64 = base64Url.replace("-", "+").replace("_", "/");
  //     return JSON.parse(window.atob(base64));
  //   }

  //   const tokenA = parseJwt(session.user.token);
  //   const role = tokenA?.role;

  //   const roleToSidebarComponent = {
  //     admin: <Sidebaradmin />,
  //     driver: <Sidebardriver />,
  //     dispatcher: <Sidebardispatcher />,
  //     user: <Sidebaruser />,
  //   };

  //   const defaultSidebarComponent = <Sidebaruser />;

  //   const selectedSidebarComponent =
  //     roleToSidebarComponent[role] || defaultSidebarComponent;

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;
