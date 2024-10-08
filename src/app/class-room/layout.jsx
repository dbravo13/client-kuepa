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

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;
