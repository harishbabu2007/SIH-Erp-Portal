'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, GraduationCap, LogOut, User as UserIcon, Settings, Bell, Chrome as Home, UserPlus, CreditCard, Building2, BookOpen } from 'lucide-react';
import { authService, User } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  user: User;
  currentPage?: string;
}

export function Navbar({ user, currentPage = 'dashboard' }: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: `/dashboard/${user.role}`, 
      icon: Home,
      adminOnly: false 
    },
    { 
      name: 'Admissions', 
      href: '/dashboard/admissions', 
      icon: UserPlus,
      adminOnly: false 
    },
    { 
      name: 'Exams', 
      href: '/dashboard/exams', 
      icon: GraduationCap,
      adminOnly: false 
    },
    { 
      name: 'Fees', 
      href: '/dashboard/fees', 
      icon: CreditCard,
      adminOnly: false 
    },
    { 
      name: 'Hostel', 
      href: '/dashboard/hostel', 
      icon: Building2,
      adminOnly: false 
    },
    { 
      name: 'Library', 
      href: '/dashboard/library', 
      icon: BookOpen,
      adminOnly: false 
    }
  ];

  const filteredNavigation = navigationItems.filter(item => 
    !item.adminOnly || user.role === 'admin'
  );

  const NavigationLinks = ({ mobile = false }) => (
    <>
      {filteredNavigation.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.name.toLowerCase() || 
                        (currentPage === 'admin' && item.name === 'Dashboard') ||
                        (currentPage === 'student' && item.name === 'Dashboard');
        
        return (
          <Button
            key={item.name}
            variant={isActive ? "default" : "ghost"}
            className={`${mobile ? 'w-full justify-start' : ''} ${
              isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => {
              router.push(item.href);
              if (mobile) setMobileMenuOpen(false);
            }}
          >
            <Icon className="h-4 w-4 mr-2" />
            {item.name}
          </Button>
        );
      })}
    </>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col space-y-4 py-4">
                <div className="flex items-center space-x-2 px-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <span className="text-lg font-bold">EFA</span>
                </div>
                <NavigationLinks mobile />
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EFA</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2 mx-8">
          <NavigationLinks />
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              2
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.role}
                    {user.studentId && ` • ${user.studentId}`}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => router.push('/dashboard/profile')}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}