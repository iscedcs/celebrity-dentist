import { DataTable } from "@/components/shared/custom-datatable";
import { PaginationComponent } from "@/components/shared/custom-pagination";
import SearchBar from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { appointment_columns } from "@/lib/columns";
import { DUMMY_APPOINTMENT } from "@/lib/const";
import { Plus } from "lucide-react";
import Link from "next/link";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function Appointment(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ?? 1;
  const limit = searchParams.limit ?? 20;
  const query = searchParams.q;

  const appointments = DUMMY_APPOINTMENT;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between gap-2 flex-wrap items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Appointment (10)
            </h1>
            <p className="text-gray-600">
              Manage aapointment records and information
            </p>
          </div>
          <div className=" flex gap-2">
            <Link href="/patients/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Book appointment
              </Button>
            </Link>
          </div>
        </div>

        <div className="">
          <div className=" flex flex-row gap-4">
            <SearchBar
              query={query}
              placeholder="Search with first name, last name or email address"
            />
          </div>

          <DataTable
            showColumnButton={false}
            showSearch={false}
            columns={appointment_columns}
            data={appointments?.data ?? []}
          />
          <br />
          {appointments?.meta.total_record >= 20 && (
            <PaginationComponent
              limit={Number(limit)}
              totalItems={appointments?.meta.total_record}
              siblingCount={1}
            />
          )}
        </div>
      </main>
    </div>
  );
}
