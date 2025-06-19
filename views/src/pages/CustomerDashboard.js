import CustomerSidebar from "./../components/CustomerSidebar";

export default function CustomerDashboard() {
  return (
    <div className="flex h-screen">
      <CustomerSidebar />
      <main className="flex-1 p-5">
        <h1 className="text-2xl font-bold">Welcome to Customer Dashboard</h1>
        <p className="mt-2">Manage your orders, profile, and settings.</p>
      </main>
    </div>
  );
}
