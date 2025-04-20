import {SidebarProvider, Sidebar, SidebarContent, MainNav} from '@/components/sidebar';

export default function IncomePage() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <MainNav />
        </SidebarContent>
      </Sidebar>
      <div className="flex-1 p-4">
        Income Page Content
      </div>
    </SidebarProvider>
  );
}
