import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import { type Rsvp, type Wish } from "@shared/schema";
import AdminLogin from "@/components/wedding/AdminLogin";

export default function Admin() {
  const [, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["/api/current-user"],
    onSuccess: (data) => {
      setIsAuthenticated(data.loggedIn);
    },
  });

  // Get all RSVPs
  const { 
    data: rsvps, 
    isLoading: rsvpsLoading 
  } = useQuery<Rsvp[]>({
    queryKey: ["/api/rsvps"],
    enabled: isAuthenticated,
  });

  // Get all wishes
  const { 
    data: wishes, 
    isLoading: wishesLoading 
  } = useQuery<Wish[]>({
    queryKey: ["/api/wishes"],
    enabled: isAuthenticated,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout", {});
    },
    onSuccess: () => {
      setIsAuthenticated(false);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // If not authenticated, show login form
  if (!isAuthenticated && !authLoading) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // Stats calculation
  const totalRsvps = rsvps?.length || 0;
  const attending = rsvps?.filter(r => r.attending).length || 0;
  const notAttending = rsvps?.filter(r => !r.attending).length || 0;
  const totalGuests = rsvps?.reduce((acc, rsvp) => acc + rsvp.guests, 0) || 0;
  const totalWishes = wishes?.length || 0;

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Wedding Admin</h1>
          <p className="text-neutral-600">Manage RSVPs and wishes</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/")}>
            View Website
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total RSVPs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalRsvps}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Attending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{attending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Guests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalGuests}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Wishes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalWishes}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for RSVP and Wishes */}
        <Tabs defaultValue="rsvps">
          <TabsList className="mb-4">
            <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
            <TabsTrigger value="wishes">Wishes</TabsTrigger>
          </TabsList>

          <TabsContent value="rsvps">
            <Card>
              <CardHeader>
                <CardTitle>RSVP List</CardTitle>
              </CardHeader>
              <CardContent>
                {rsvpsLoading ? (
                  <p>Loading RSVPs...</p>
                ) : rsvps && rsvps.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">Name</th>
                          <th className="text-left py-2 px-4">Email</th>
                          <th className="text-left py-2 px-4">Attending</th>
                          <th className="text-left py-2 px-4">Guests</th>
                          <th className="text-left py-2 px-4">Meal</th>
                          <th className="text-left py-2 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rsvps.map((rsvp) => (
                          <tr key={rsvp.id} className="border-b hover:bg-neutral-100">
                            <td className="py-3 px-4">{rsvp.name}</td>
                            <td className="py-3 px-4">{rsvp.email}</td>
                            <td className="py-3 px-4">
                              {rsvp.attending ? (
                                <span className="text-green-600 font-medium">Yes</span>
                              ) : (
                                <span className="text-red-600 font-medium">No</span>
                              )}
                            </td>
                            <td className="py-3 px-4">{rsvp.guests}</td>
                            <td className="py-3 px-4">{rsvp.meal || "-"}</td>
                            <td className="py-3 px-4">{formatDate(rsvp.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center py-8 text-neutral-500">No RSVPs yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishes">
            <Card>
              <CardHeader>
                <CardTitle>Wishes List</CardTitle>
              </CardHeader>
              <CardContent>
                {wishesLoading ? (
                  <p>Loading wishes...</p>
                ) : wishes && wishes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">Name</th>
                          <th className="text-left py-2 px-4">Message</th>
                          <th className="text-left py-2 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wishes.map((wish) => (
                          <tr key={wish.id} className="border-b hover:bg-neutral-100">
                            <td className="py-3 px-4">{wish.name}</td>
                            <td className="py-3 px-4">{wish.message}</td>
                            <td className="py-3 px-4">{formatDate(wish.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center py-8 text-neutral-500">No wishes yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
