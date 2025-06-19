import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Publishers from "./pages/Publishers";
import Categories from "./pages/Categories";
import Books from "./pages/Books";
import Country from "./pages/Country";
import States from "./pages/States";
import Regions from "./pages/Regions";
import Departments from "./pages/Departments";
import Designations from "./pages/Designations";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerBooks from "./pages/CustomerBooks";
import ProductsPage from "./pages/ProductsPage";
import Roles from "./pages/Roles";
import AccountPage from "./pages/Account";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import MainPage from "./pages/MainPage";
import CartPage from "./pages/CartPage";
import Navbar from "./components/Navbar";
import PaymentPage from "./pages/PaymentPage";
import Orders from "./pages/orders";
import Payments from "./pages/payments";
import Contact from './pages/Contact';
import Settings from './pages/Settings'
import ToastSetup from './services/Toast-Container';
import ForgotPassword from "./components/ForgotPassword";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/publishers" element={<Publishers />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/books" element={<Books />} />
        <Route path="/countries" element={<Country />} />
        <Route path="/states" element={<States />} />
        <Route path="/regions" element={<Regions />} />
        <Route path="/prods" element={<ProductsPage />} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/designations" element={<Designations />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/customers" element={<CustomerDashboard />} />
        <Route path="/customer-books" element={<CustomerBooks />} />
        <Route path="/customer-wishlist" element={<Wishlist />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <ToastSetup />
    </>
  );
}

export default App;
