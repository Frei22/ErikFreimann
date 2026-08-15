import type { Metadata } from "next";
import { CinemaPage } from "@/components/cinema/CinemaPage";
import { NIGHT } from "@/components/cinema/theme";

export const metadata: Metadata = {
  title: "Cinema / Night — Erik Freimann",
};

export default function Page() {
  return <CinemaPage theme={NIGHT} />;
}
