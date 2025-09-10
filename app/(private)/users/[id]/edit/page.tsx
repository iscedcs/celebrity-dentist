import { UserEditForm } from "@/components/users/user-edit-form";

type Params = Promise<{ id: string }>;

export default async function EditUser({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Edit User Information
          </h1>
          <p className="text-gray-600">Edit system user and role assignment</p>
        </div>

        <UserEditForm id={id} />
      </main>
    </div>
  );
}
