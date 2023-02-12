import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Authentication from './pages/Authentication';
import Product from './pages/Product';
import SearchItems from './pages/SearchItems';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContextProvider } from './hooks/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <SearchItems />
                </ProtectedRoute>
              }
            />
            <Route path="/autenticacao" element={<Authentication />} />
            <Route
              path="/:id"
              element={
                <ProtectedRoute>
                  <Product />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
