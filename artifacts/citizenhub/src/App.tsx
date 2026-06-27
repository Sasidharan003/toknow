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

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
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
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
