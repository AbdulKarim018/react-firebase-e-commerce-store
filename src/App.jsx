import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import AdminHeader from "./components/admin/AdminHeader";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CartContextProvider from "./contexts/Cart";
import UserContextProvider from "./contexts/User";
import AdminProductsPage from "./pages/admin/Products";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Product from "./pages/Product";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";

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
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                <Route path="admin" element={<AdminLayout />}>
                  <Route path="products" element={<AdminProductsPage />} />
                  {/* <Route path="orders" element={<Orders />} /> */}
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
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

const AdminLayout = () => {
  return (
    <div>
      <AdminHeader />
      <Outlet />
    </div>
  );
};
