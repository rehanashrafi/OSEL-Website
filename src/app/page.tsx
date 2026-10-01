import type { Metadata } from "next";
import HomePage from "@/components/pages/home/HomePage";

export const metadata: Metadata = {
  title: "OSEL Devices | LED Displays, Hearing Aids & Precision Manufacturing",
  description:
    "Explore OSEL’s LED display range, hearing aids and advanced manufacturing. Original equipment manufacturing from Greater Noida, India.",
};
export default function Page() {
  return <HomePage />;
}
