import { getCurrentUser } from "@/actions/auth";
import { getAllUsers } from "@/actions/users";
import { DataTable } from "@/components/shared/custom-datatable";
import { PaginationComponent } from "@/components/shared/custom-pagination";
import Filter from "@/components/shared/filter";
import SearchBar from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { user_columns } from "@/lib/columns";
import { FIELDS } from "@/lib/const";
import { Plus } from "lucide-react";
import Link from "next/link";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function UsersPage(props: { searchParams: SearchParams }) {
  const user = await getCurrentUser();

  const searchParams = await props.searchParams;
  const page = searchParams.page ?? 1;
  const limit = searchParams.limit ?? 20;
  const query = searchParams.q;
  const role = searchParams.role;

  // if (!user || !["ADMIN", "SUPERADMIN"].includes(user.role)) {
  //   redirect("/dashboard");
  // }

  const users = await getAllUsers({
    fields: FIELDS,
    limit: Number(limit),
    page: Number(page),
    query: query,
    role: role,
  });

  // console.log({ users });

  // console.log(users?.records);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between flex-wrap gap-2 items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Users ({users?.totalRecord})
            </h1>
            <p className="text-gray-600">Manage system users and their roles</p>
          </div>
          <Link href="/users/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </Link>
        </div>

        <div className=" w-full">
          <div className=" flex flex-row gap-4">
            <SearchBar
              query={query}
              placeholder="Search with first name, last name or email address"
            />
            <Filter role={role} placeholder="Filter role" />
          </div>

          <DataTable
            showColumnButton={false}
            showSearch={false}
            columns={user_columns}
            data={users?.records ?? []}
          />
          <br />
          {users?.totalRecord >= 20 && (
            <PaginationComponent
              limit={Number(limit)}
              totalItems={users?.totalRecord}
              siblingCount={1}
            />
          )}
        </div>
      </main>
    </div>
  );
}
