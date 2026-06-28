import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Laws from "@/pages/Laws";
import LawDetail from "@/pages/LawDetail";
import Schemes from "@/pages/Schemes";
import SchemeDetail from "@/pages/SchemeDetail";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Complaints from "@/pages/Complaints";
import ComplaintDetail from "@/pages/ComplaintDetail";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import Chat from "@/pages/Chat";
import Learning from "@/pages/Learning";
import Bookmarks from "@/pages/Bookmarks";
import Documents from "@/pages/Documents";
import NearbyServices from "@/pages/NearbyServices";
import Profile from "@/pages/Profile";
import Lawyers from "@/pages/Lawyers";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";

const queryClient = new QueryClient();

interface UserType {
  id: number;
  email: string;
  role: string;
}

function Router({ user, onLogout }: { user: UserType; onLogout: () => void }) {
  return (
    <Layout user={user} onLogout={onLogout}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/laws" component={Laws} />
        <Route path="/laws/:id">{(params) => <LawDetail id={params.id} />}</Route>
        <Route path="/schemes" component={Schemes} />
        <Route path="/schemes/:id">{(params) => <SchemeDetail id={params.id} />}</Route>
        <Route path="/services" component={Services} />
        <Route path="/services/:id">{(params) => <ServiceDetail id={params.id} />}</Route>
        <Route path="/complaints" component={Complaints} />
        <Route path="/complaints/:id">{(params) => <ComplaintDetail id={params.id} />}</Route>
        <Route path="/news" component={News} />
        <Route path="/news/:id">{(params) => <NewsDetail id={params.id} />}</Route>
        <Route path="/chat" component={Chat} />
        <Route path="/learning" component={Learning} />
        <Route path="/bookmarks" component={Bookmarks} />
        <Route path="/documents" component={Documents} />
        <Route path="/nearby" component={NearbyServices} />
        <Route path="/lawyers" component={Lawyers} />
        <Route path="/profile" component={Profile} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const [user, setUser] = useState<UserType | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
    fetch(`${BASE}/api/auth/me`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Login onLoginSuccess={(u) => setUser(u)} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router user={user} onLogout={() => setUser(null)} />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
