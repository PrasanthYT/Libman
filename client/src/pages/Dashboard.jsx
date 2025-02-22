import { useQuery } from "@tanstack/react-query";
import { getPendingIssuance } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Book, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pendingIssuance"],
    queryFn: getPendingIssuance,
    onSuccess: () => {
      toast.success("Data loaded successfully");
    },
    onError: () => {
      toast.error("Failed to load data");
    },
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    toast.success("Logged out successfully!")
    navigate("/")
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar>
          <SidebarHeader>
            <h2 className="text-xl font-bold px-4 py-2">Library Dashboard</h2>
          </SidebarHeader>
          <SidebarContent>
            <Button variant="ghost" className="w-full justify-start">
              <Book className="mr-2 h-4 w-4" />
              Pending Returns
            </Button>
            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start mt-auto">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1 overflow-auto">
          <header className="flex items-center h-16 px-4 border-b bg-white">
            <SidebarTrigger>
              <Menu className="h-6 w-6" />
            </SidebarTrigger>
            <h1 className="ml-4 text-2xl font-semibold">
              Pending Book Returns
            </h1>
          </header>
          <main className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Returns</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-center py-4">Loading...</p>
                ) : isError ? (
                  <p className="text-red-500 text-center py-4">
                    Error fetching data
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member Name</TableHead>
                        <TableHead>Book Title</TableHead>
                        <TableHead>Due Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center">
                            No pending returns
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.member_name}</TableCell>
                            <TableCell>{item.book_name}</TableCell>
                            <TableCell>
                              {new Date(
                                item.target_return_date
                              ).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
