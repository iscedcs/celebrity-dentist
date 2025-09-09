import { getCurrentUser } from '@/actions/auth';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Button } from '@/components/ui/button';
import { UsersTable } from '@/components/users/users-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function UsersPage() {
    const user = await getCurrentUser();

    if (!user || !['ADMIN', 'SUPERADMIN'].includes(user.role)) {
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader user={user} />

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between flex-wrap gap-2 items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            User Management
                        </h1>
                        <p className="text-gray-600">
                            Manage system users and their roles
                        </p>
                    </div>
                    <Link href="/users/new">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add User
                        </Button>
                    </Link>
                </div>

                <UsersTable />
            </main>
        </div>
    );
}
