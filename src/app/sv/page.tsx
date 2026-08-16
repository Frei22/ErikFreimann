import { DescentPage } from "@/components/DescentPage";
import { locales } from "@/config/copy";
import { metadataFor } from "@/lib/metadata";

export const metadata = metadataFor("sv");

export default function Svenska() {
  return <DescentPage copy={locales.sv} />;
}
