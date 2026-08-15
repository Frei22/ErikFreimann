import type { Metadata } from "next";
import { CinemaPage } from "@/components/cinema/CinemaPage";
import { PRESS } from "@/components/cinema/theme";

export const metadata: Metadata = {
  title: "Cinema / Press — Erik Freimann",
};

export default function Page() {
  return <CinemaPage theme={PRESS} />;
}
