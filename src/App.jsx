import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { Toaster } from "sonner";
import AdminHeader from "./components/admin/AdminHeader";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CartContextProvider from "./contexts/Cart";
import UserContextProvider, { useUser } from "./contexts/User";
import AdminProductsPage from "./pages/admin/Products";
import AdminOrdersPage from "./pages/admin/Orders";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Product from "./pages/Product";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <UserContextProvider>
        <CartContextProvider>
          <QueryClientProvider client={queryClient}>
            <Toaster richColors position="top-right" />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="/shop/:id" element={<Product />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                <Route path="admin" element={<AdminLayout />}>
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </CartContextProvider>
      </UserContextProvider>
    </>
  );
}

export default App;

const PublicLayout = () => {
  const { data: user } = useUser();

  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

const AdminLayout = () => {
  const { data: user } = useUser();
  return (
    <div>
      <AdminHeader />
      <Outlet />
    </div>
  );
};
