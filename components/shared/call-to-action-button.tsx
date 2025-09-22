import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "../ui/button";

export default async function CallToActionButton({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const session = await auth();

  return (
    <>
      {session?.user ? (
        <Button asChild size="sm" className={`${isMobile ? "w-full" : null}`}>
          <Link href={"/dashboard"}>Dashboard</Link>
        </Button>
      ) : (
        <Button size="sm" className={`${isMobile ? "w-full" : null}`}>
          <Link href={"/sign-in"}>Sign in</Link>
        </Button>
      )}
    </>
  );
}
