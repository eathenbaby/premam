import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Send from "@/pages/Send";
import Feed from "@/pages/Feed";
import Inbox from "@/pages/Inbox";
import Terms from "@/pages/Terms";
import { FloatingHearts } from "@/components/InteractiveComponents";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Send} />
      <Route path="/feed" component={Feed} />
      <Route path="/inbox" component={Inbox} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FloatingHearts />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
