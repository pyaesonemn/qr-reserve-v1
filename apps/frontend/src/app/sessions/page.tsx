import { sessionServerApi } from '@/lib/server-api';
import { SessionsList } from './components/sessions-list';
import { CreateSessionButton } from './components/create-session-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Server Component - handles initial data fetching
export default async function SessionsPage() {
  // Fetch initial data on the server with graceful error handling
  const initialSessions = await sessionServerApi.safe.getAll();

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
          <p className="text-muted-foreground">
            Manage your booking sessions and view analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/sessions/analytics">View Analytics</Link>
          </Button>
          <CreateSessionButton />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialSessions.length}</div>
            <p className="text-xs text-muted-foreground">
              Active and inactive sessions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {initialSessions.filter(s => s.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently accepting bookings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {initialSessions.reduce((sum, s) => sum + (s.bookingCount || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List - Client Component with real-time updates */}
      <Card>
        <CardHeader>
          <CardTitle>All Sessions</CardTitle>
          <CardDescription>
            Manage your sessions, view bookings, and update settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SessionsList initialData={initialSessions} />
        </CardContent>
      </Card>
    </div>
  );
}