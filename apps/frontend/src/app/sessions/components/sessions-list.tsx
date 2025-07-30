"use client";

import {
  useSessions,
  useToggleSessionStatus,
  useDeleteSession,
} from "@/hooks/use-sessions";
import { Session } from "@repo/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, Play, Pause } from "lucide-react";
import { useState } from "react";
import { QueryErrorDisplay } from "@/components/error-boundary";
import Link from "next/link";
import { format } from "date-fns";

interface SessionsListProps {
  initialData: Session[];
}

export function SessionsList({ initialData }: SessionsListProps) {
  const [optimisticUpdates, setOptimisticUpdates] = useState<
    Record<string, Partial<Session>>
  >({});

  // Use React Query with initial server data
  const {
    data: sessions = initialData,
    isLoading,
    error,
    refetch,
  } = useSessions();

  // Ensure sessions is always an array
  const safeSessions = Array.isArray(sessions) ? sessions : [];

  const toggleStatusMutation = useToggleSessionStatus();
  const deleteMutation = useDeleteSession();

  const handleToggleStatus = async (
    sessionId: string,
    currentStatus: boolean
  ) => {
    // Optimistic update
    setOptimisticUpdates((prev) => ({
      ...prev,
      [sessionId]: { isActive: !currentStatus },
    }));

    try {
      await toggleStatusMutation.mutateAsync({
        id: sessionId,
        isActive: !currentStatus,
      });
      // Clear optimistic update on success
      setOptimisticUpdates((prev) => {
        const { [sessionId]: _, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticUpdates((prev) => {
        const { [sessionId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleDelete = async (sessionId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this session? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(sessionId);
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  // Apply optimistic updates to the data
  const displaySessions = safeSessions.map((session) => ({
    ...session,
    ...optimisticUpdates[session.id],
  }));

  if (error) {
    return (
      <QueryErrorDisplay
        error={error}
        retry={() => refetch()}
      />
    );
  }

  if (isLoading && !initialData.length) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (!displaySessions.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No sessions found</p>
        <p className="text-sm text-muted-foreground">
          Create your first session to start accepting bookings
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Real-time status indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        Live data - updates automatically
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displaySessions.map((session) => {
            const isUpdating =
              optimisticUpdates[session.id] ||
              toggleStatusMutation.isPending ||
              deleteMutation.isPending;

            return (
              <TableRow
                key={session.id}
                className={isUpdating ? "opacity-50" : ""}
              >
                <TableCell className="font-medium">
                  <div>
                    <p className="font-semibold">{session.title}</p>
                    {session.description && (
                      <p className="text-sm text-muted-foreground truncate max-w-xs">
                        {session.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{format(new Date(session.startTime), "MMM dd, yyyy")}</p>
                    <p className="text-muted-foreground">
                      {format(new Date(session.startTime), "h:mm a")} -
                      {format(new Date(session.endTime), "h:mm a")}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={session.isActive ? "default" : "secondary"}>
                    {session.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {session.bookingCount || 0}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {session.maxBookings}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/sessions/${session.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/sessions/${session.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Session
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          handleToggleStatus(session.id, session.isActive)
                        }
                        disabled={!!isUpdating}
                      >
                        {session.isActive ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(session.id)}
                        disabled={!!isUpdating}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
