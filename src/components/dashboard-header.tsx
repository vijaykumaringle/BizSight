import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between space-y-0 pb-2">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="https://picsum.photos/50/50" alt="Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, User!
        </h1>
      </div>
    </div>
  );
}

export default DashboardHeader;
