import React from "react";
import FooterClient from "./footerClient";
import { auth } from "@/auth"

export default async function Footer() {
  const session = await auth();

  return <FooterClient session={session}/>;
}
