export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'other',
    title: 'Administrador',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'consultUsers',
        title: 'Roles y Permisos',
        type: 'item',
        url: '/consult-users',
        classes: 'nav-item',
        icon: 'user-add'
      },
      {
        id: 'consultAttendant',
        title: 'Ver Pistas de Auditoría',
        type: 'item',
        url: '/consult-logs',
        classes: 'nav-item',
        icon: 'audit'
      }
    ]
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Reportes',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'area-chart',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'other',
    title: 'Proyectos',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'consultProjects',
        title: 'Distribución de ingresos',
        type: 'item',
        url: '/consult-income-page',
        classes: 'nav-item',
        icon: 'box-plot'
      },
      {
        id: 'consultProjects',
        title: 'Transacciones de Ingresos',
        type: 'item',
        url: '/consult-project-page',
        classes: 'nav-item',
        icon: 'stock'
      },
      {
        id: 'createProject',
        title: 'Gestionar Proyecto',
        type: 'item',
        url: '/create-project-page',
        classes: 'nav-item',
        icon: 'profile'
      }
    ]
  },
  {
    id: 'other',
    title: 'Clientes',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'consultClients',
        title: 'Gestionar Cliente',
        type: 'item',
        url: '/consult-client-page',
        classes: 'nav-item',
        icon: 'edit'
      },
      {
        id: 'consultClientType',
        title: 'Gestionar Tipo de Cliente',
        type: 'item',
        url: '/consult-client-type-page',
        classes: 'nav-item',
        icon: 'edit'
      },

    ]
  },
  {
    id: 'other',
    title: 'Personal de Proyectos',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'consultAttendant',
        title: 'Gestionar Personal Proyecto',
        type: 'item',
        url: '/consult-attendant-page',
        classes: 'nav-item',
        icon: 'edit'
      }
    ]
  },
  {
    id: 'other',
    title: 'Tipo de Trabajo',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'consultAttendant',
        title: 'Gestionar Tipo de Trabajo',
        type: 'item',
        url: '/consult-typework',
        classes: 'nav-item',
        icon: 'edit'
      }
    ]
  },
  /*{
    id: 'utilities',
    title: 'UI Components',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'typography',
        title: 'Typography',
        type: 'item',
        classes: 'nav-item',
        url: '/typography',
        icon: 'font-size'
      },
      {
        id: 'color',
        title: 'Colors',
        type: 'item',
        classes: 'nav-item',
        url: '/color',
        icon: 'bg-colors'
      },
      {
        id: 'tabler',
        title: 'Tabler',
        type: 'item',
        classes: 'nav-item',
        url: 'https://ant.design/components/icon',
        icon: 'ant-design',
        target: true,
        external: true
      }
    ]
  }*/
];

export const NavigationItems2: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Reportes',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'area-chart',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'other',
    title: 'Proyectos',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'consultProjects',
        title: 'Distribución de ingresos',
        type: 'item',
        url: '/consult-income-page',
        classes: 'nav-item',
        icon: 'box-plot'
      },
      {
        id: 'consultProjects',
        title: 'Transacciones de Ingresos',
        type: 'item',
        url: '/consult-project-page',
        classes: 'nav-item',
        icon: 'stock'
      },
      {
        id: 'createProject',
        title: 'Consultar Proyecto',
        type: 'item',
        url: '/create-project-page',
        classes: 'nav-item',
        icon: 'search'
      }
    ]
  },
  {
    id: 'other',
    title: 'Clientes',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'consultClients',
        title: 'Consultar Cliente',
        type: 'item',
        url: '/consult-client-page',
        classes: 'nav-item',
        icon: 'search'
      },
      {
        id: 'consultClientType',
        title: 'Consultar Tipo de Cliente',
        type: 'item',
        url: '/consult-client-type-page',
        classes: 'nav-item',
        icon: 'search'
      },

    ]
  },
  {
    id: 'other',
    title: 'Personal de Proyectos',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'consultAttendant',
        title: 'Consultar Personal Proyecto',
        type: 'item',
        url: '/consult-attendant-page',
        classes: 'nav-item',
        icon: 'search'
      }
    ]
  },
  {
    id: 'other',
    title: 'Tipo de Trabajo',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'consultAttendant',
        title: 'Consultar Tipo de Trabajo',
        type: 'item',
        url: '/consult-typework',
        classes: 'nav-item',
        icon: 'search'
      }
    ]
  },
];

export const NavigationItems3: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Reportes',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'area-chart',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'other',
    title: 'Proyectos',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'consultProjects',
        title: 'Distribución de ingresos',
        type: 'item',
        url: '/consult-income-page',
        classes: 'nav-item',
        icon: 'box-plot'
      },
      {
        id: 'consultProjects',
        title: 'Transacciones de Ingresos',
        type: 'item',
        url: '/consult-project-page',
        classes: 'nav-item',
        icon: 'stock'
      },
      {
        id: 'createProject',
        title: 'Gestionar Proyecto',
        type: 'item',
        url: '/create-project-page',
        classes: 'nav-item',
        icon: 'profile'
      }
    ]
  },
  {
    id: 'other',
    title: 'Clientes',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'consultClients',
        title: 'Gestionar Cliente',
        type: 'item',
        url: '/consult-client-page',
        classes: 'nav-item',
        icon: 'edit'
      },
      {
        id: 'consultClientType',
        title: 'Gestionar Tipo de Cliente',
        type: 'item',
        url: '/consult-client-type-page',
        classes: 'nav-item',
        icon: 'edit'
      },

    ]
  },
  {
    id: 'other',
    title: 'Personal de Proyectos',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'consultAttendant',
        title: 'Gestionar Personal Proyecto',
        type: 'item',
        url: '/consult-attendant-page',
        classes: 'nav-item',
        icon: 'edit'
      }
    ]
  },
  {
    id: 'other',
    title: 'Tipo de Trabajo',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'consultAttendant',
        title: 'Gestionar Tipo de Trabajo',
        type: 'item',
        url: '/consult-typework',
        classes: 'nav-item',
        icon: 'edit'
      }
    ]
  },
  /*{
    id: 'utilities',
    title: 'UI Components',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'typography',
        title: 'Typography',
        type: 'item',
        classes: 'nav-item',
        url: '/typography',
        icon: 'font-size'
      },
      {
        id: 'color',
        title: 'Colors',
        type: 'item',
        classes: 'nav-item',
        url: '/color',
        icon: 'bg-colors'
      },
      {
        id: 'tabler',
        title: 'Tabler',
        type: 'item',
        classes: 'nav-item',
        url: 'https://ant.design/components/icon',
        icon: 'ant-design',
        target: true,
        external: true
      }
    ]
  }*/
];