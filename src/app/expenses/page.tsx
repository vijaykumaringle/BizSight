import {SidebarProvider, Sidebar, SidebarContent, MainNav} from '@/components/sidebar';

export default function ExpensesPage() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <MainNav />
        </SidebarContent>
      </Sidebar>
      <div className="flex-1 p-4">
        Expenses Page Content
      </div>
    </SidebarProvider>
  );
}
