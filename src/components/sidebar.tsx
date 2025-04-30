"use client";

import React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {VariantProps, cva} from 'class-variance-authority';
import {PanelLeft, X} from 'lucide-react';

import {useIsMobile} from '@/hooks/use-mobile';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Separator} from '@/components/ui/separator';
import {Sheet, SheetContent} from '@/components/ui/sheet';
import {Skeleton} from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {Icons} from './icons';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarContext = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);

    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === 'function' ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open]
    );

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile(open => !open)
        : setOpen(open => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? 'expanded' : 'collapsed';

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={{
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties}
            className={cn(
              'group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar',
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = 'SidebarProvider';

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
  }
>(
  (
    {
      side = 'left',
      variant = 'sidebar',
      collapsible = 'offcanvas',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const {isMobile, state, openMobile, setOpenMobile} = useSidebar();

    if (collapsible === 'none') {
      return (
        <div
          className={cn(
            'flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={{
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties}
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        data-sidebar="sidebar"
        data-variant={variant}
        data-state={state}
        data-collapsible={collapsible}
        className={cn(
          'group/sidebar z-20 flex h-full shrink-0 flex-col bg-sidebar text-sidebar-foreground',
          state === 'expanded'
            ? 'w-[--sidebar-width]'
            : 'w-[--sidebar-width-icon]',
          variant === 'floating' && 'absolute shadow-md',
          variant === 'inset' && 'border-r border-r-border',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Sidebar.displayName = 'Sidebar';

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({className, onClick, ...props}, ref) => {
  const {toggleSidebar, isMobile, state} = useSidebar();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        'group/trigger shrink-0 transition-transform hover:bg-secondary',
        state === 'collapsed' && 'rotate-180',
        className
      )}
      onClick={() => {
        toggleSidebar();
        onClick?.();
      }}
      ref={ref}
      {...props}
    >
      {isMobile ? (
        <X className="h-4 w-4" />
      ) : (
        <PanelLeft className="h-4 w-4" />
      )}
    </Button>
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'>
>(({className, ...props}, ref) => {
  const {toggleSidebar, state} = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'group/rail rounded-none border-b border-b-border transition-transform hover:bg-secondary',
        state === 'collapsed' && 'rotate-180',
        className
      )}
      onClick={toggleSidebar}
      ref={ref}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  );
});
SidebarRail.displayName = 'SidebarRail';

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'main'>
>(({className, children, ...props}, ref) => {
  return (
    <main
      className={cn('flex flex-1 flex-col gap-4 p-4', className)}
      ref={ref}
      {...props}
    >
      {children}
    </main>
  );
});
SidebarInset.displayName = 'SidebarInset';

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({className, ...props}, ref) => {
  return (
    <div className="group/sidebar-input p-2">
      <Input ref={ref} className={cn('h-8', className)} {...props} />
    </div>
  );
});
SidebarInput.displayName = 'SidebarInput';

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({className, children, ...props}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-between p-2', className)}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarHeader.displayName = 'SidebarHeader';

function ProfileLink() {
  return (
    <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            href="/profile"
            asChild
          >
            <a className="flex items-center gap-2">
              <Icons.user />
              <span>Profile</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
    </SidebarMenu>
  );
}

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({className, children, ...props}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('mt-auto flex items-center justify-between p-2', className)}
      {...props}
    >
         <ProfileLink/>

    </div>
  );
});
SidebarFooter.displayName = 'SidebarFooter';

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({className, ...props}, ref) => {
  return (
    <Separator ref={ref} className={cn('my-2', className)} {...props} />
  );
});
SidebarSeparator.displayName = 'SidebarSeparator';

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({className, children, ...props}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-1 flex-col overflow-hidden p-2', className)}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarContent.displayName = 'SidebarContent';

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({className, children, ...props}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('group/sidebar-group flex items-center', className)}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarGroup.displayName = 'SidebarGroup';

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {asChild?: boolean}
>(({className, asChild = false, children, ...props}, ref) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cn(
        'px-2 py-1 text-xs font-medium text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {asChild?: boolean}
>(({className, asChild = false, children, ...props}, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      className={cn('ml-auto', className)}
      {...props}
    >
      {children}
    </Comp>
  );
});
SidebarGroupAction.displayName = 'SidebarGroupAction';

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({className, children, ...props}, ref) => (
  <div ref={ref} className={cn('flex-1', className)} {...props}>
    {children}
  </div>
));
SidebarGroupContent.displayName = 'SidebarGroupContent';

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({className, children, ...props}, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-col gap-1 group-data-[collapsible=icon]:px-0', className)}
    {...props}
  >
    {children}
  </ul>
));
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({className, children, ...props}, ref) => (
  <li ref={ref} className={cn('relative', className)} {...props}>
    {children}
  </li>
));
SidebarMenuItem.displayName = 'SidebarMenuItem';

const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:!p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = 'default',
      size = 'default',
      tooltip,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const {isMobile, state} = useSidebar();

    const buttonContent = (
      <Comp
        ref={ref}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({variant, size, className}))}
        {...props}
      >
        {children}
      </Comp>
    );

    if (!tooltip) {
      return buttonContent;
    }

    const tooltipContentProps =
      typeof tooltip === 'string' ? {children: tooltip} : tooltip;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
        <TooltipContent {...tooltipContentProps} />
      </Tooltip>
    );
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    showOnHover?: boolean;
  }
>(({className, asChild = false, showOnHover = false, children, ...props}, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      className={cn(
        'absolute right-2 top-1/2 z-10 -translate-y-1/2',
        showOnHover &&
          'opacity-0 transition-opacity group-hover/menu-item:opacity-100',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});
SidebarMenuAction.displayName = 'SidebarMenuAction';

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({className, children, ...props}, ref) => (
  <div
    ref={ref}
    className={cn(
      'ml-auto group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:right-0 group-data-[collapsible=icon]:top-0 group-data-[collapsible=icon]:z-10 group-data-[collapsible=icon]:translate-x-1/2 group-data-[collapsible=icon]:-translate-y-1/2',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SidebarMenuBadge.displayName = 'SidebarMenuBadge';

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    showIcon?: boolean;
  }
>(({className, showIcon = false, ...props}, ref) => {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div ref={ref} className={cn('flex items-center gap-2', className)} {...props}>
      {showIcon ? (
        <Skeleton className="size-8 shrink-0 rounded-md group-data-[collapsible=icon]:size-8" />
      ) : null}
      <Skeleton
        className="h-4 w-[var(--skeleton-width)]"
        style={{"--skeleton-width": width} as React.CSSProperties}
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton';

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({className, children, ...props}, ref) => (
  <ul
    ref={ref}
    className={cn('ml-6 mt-1 flex flex-col gap-1 border-l border-border pl-4', className)}
    {...props}
  >
    {children}
  </ul>
));
SidebarMenuSub.displayName = 'SidebarMenuSub';

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({className, children, ...props}, ref) => {
  return (
    <li ref={ref} className={cn(className)} {...props}>
      {children}
    </li>
  );
});
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<'a'> & {
    asChild?: boolean;
    size?: 'sm' | 'md';
    isActive?: boolean;
  }
>(({asChild = false, size = 'md', isActive, className, children, ...props}, ref) => {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      ref={ref}
      className={cn(
        'block rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        size === 'sm' ? 'text-xs' : 'text-sm',
        isActive && 'bg-sidebar-accent font-medium text-sidebar-accent-foreground',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

interface MainNavItem {
  title: string;
  href: string;
  icon: keyof typeof Icons;
  disabled?: boolean;
  external?: boolean;
}

interface MainNavProps {
  pathname?: string | null; // Add pathname prop to determine active state
  className?: string;
  items?: MainNavItem[];
}

function MainNav({className, items, pathname}: MainNavProps) {
  const mainItems: MainNavItem[] = items ?? [
    {href: '/', icon: 'dashboard', title: 'Dashboard'},
    {href: '/calendar', icon: 'calendar', title: 'Calendar'},
    {href: '/income', icon: 'income', title: 'Income'},
    {href: '/expenses', icon: 'expense', title: 'Expenses'},
    {href: '/tax-insights', icon: 'taxInsights', title: 'Tax Insights'},
  ];

  return (
    <SidebarMenu>
      {mainItems.map(item => {
        const Icon = Icons[item.icon];
        const isActive = item.href === '/' ? pathname === item.href : pathname ? (pathname.startsWith(item.href + '/') || pathname === item.href) : false;

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              href={item.href}
              asChild
              isActive={isActive}
            >
              <a className={cn("flex items-center gap-2", className)}>
                <Icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

        );
      })}
    </SidebarMenu>
  );
}


export {ProfileLink,
  MainNav,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
