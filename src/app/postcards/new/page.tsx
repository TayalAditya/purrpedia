import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PostcardEditor from "@/components/canvas/PostcardEditor";

export default async function NewPostcardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return <PostcardEditor />;
}
