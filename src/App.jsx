import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import PakaianPage from "./pages/PakaianPage";
import AksesoriPage from "./pages/AksesoriPage";
import DekorasiPage from "./pages/DekorasiPage";
import SearchResults from "./pages/SearchResults";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SearchProvider } from "./contexts/SearchContext";
import Chat from "./components/Chat";
import DesignStudioPage from "./pages/DesignStudioPage";
import { WishlistProvider } from "./contexts/WishlistContext";

function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <WishlistProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produk/:name" element={<ProductPage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/pakaian" element={<PakaianPage />} />
                <Route path="/aksesori" element={<AksesoriPage />} />
                <Route path="/dekorasi" element={<DekorasiPage />} />
                <Route path="/design-studio" element={<DesignStudioPage />} />
              </Routes>
            </main>
            <Footer />
            <Chat />
          </div>
        </WishlistProvider>
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App;
