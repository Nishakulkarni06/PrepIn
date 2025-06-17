import { getCurrentUser } from "@/lib/actions/auth.action";
import CreateInterviewForm from "@/components/CreateInterviewForm";

export default async function CreateInterviewPage() {

    const user = await getCurrentUser();
  return (
    <main className="p-6">
      <CreateInterviewForm userId={user?.id ?? ""}/>
    </main>
  );
}
