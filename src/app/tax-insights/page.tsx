import {SidebarProvider, Sidebar, SidebarContent, MainNav} from '@/components/sidebar';

export default function TaxInsightsPage() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <MainNav />
        </SidebarContent>
      </Sidebar>
      <div className="flex-1 p-4">
        Tax Insights Page Content
      </div>
    </SidebarProvider>
  );
}
