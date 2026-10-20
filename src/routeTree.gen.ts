

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AboutRouteImport } from './routes/about'
import { Route as ContactRouteImport } from './routes/contact'
import { Route as DashboardRouteImport } from './routes/dashboard'
import { Route as LoginRouteImport } from './routes/login'
import { Route as PropertiesRouteImport } from './routes/properties'
import { Route as DashboardIndexRouteImport } from './routes/dashboard.index'
import { Route as DashboardSplatRouteImport } from './routes/dashboard.$'

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const AboutRoute = AboutRouteImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRouteImport,
} as any)
const ContactRoute = ContactRouteImport.update({
  id: '/contact',
  path: '/contact',
  getParentRoute: () => rootRouteImport,
} as any)
const DashboardRoute = DashboardRouteImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => rootRouteImport,
} as any)
const LoginRoute = LoginRouteImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRouteImport,
} as any)
const PropertiesRoute = PropertiesRouteImport.update({
  id: '/properties',
  path: '/properties',
  getParentRoute: () => rootRouteImport,
} as any)
const DashboardIndexRoute = DashboardIndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DashboardRoute,
} as any)
const DashboardSplatRoute = DashboardSplatRouteImport.update({
  id: '/$',
  path: '/$',
  getParentRoute: () => DashboardRoute,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/contact': typeof ContactRoute
  '/dashboard': typeof DashboardRouteWithChildren
  '/login': typeof LoginRoute
  '/properties': typeof PropertiesRoute
  '/dashboard/$': typeof DashboardSplatRoute
  '/dashboard/': typeof DashboardIndexRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/contact': typeof ContactRoute
  '/login': typeof LoginRoute
  '/properties': typeof PropertiesRoute
  '/dashboard/$': typeof DashboardSplatRoute
  '/dashboard': typeof DashboardIndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/contact': typeof ContactRoute
  '/dashboard': typeof DashboardRouteWithChildren
  '/login': typeof LoginRoute
  '/properties': typeof PropertiesRoute
  '/dashboard/$': typeof DashboardSplatRoute
  '/dashboard/': typeof DashboardIndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/contact'
    | '/dashboard'
    | '/login'
    | '/properties'
    | '/dashboard/$'
    | '/dashboard/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/contact'
    | '/login'
    | '/properties'
    | '/dashboard/$'
    | '/dashboard'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/contact'
    | '/dashboard'
    | '/login'
    | '/properties'
    | '/dashboard/$'
    | '/dashboard/'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  ContactRoute: typeof ContactRoute
  DashboardRoute: typeof DashboardRouteWithChildren
  LoginRoute: typeof LoginRoute
  PropertiesRoute: typeof PropertiesRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/contact': {
      id: '/contact'
      path: '/contact'
      fullPath: '/contact'
      preLoaderRoute: typeof ContactRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/properties': {
      id: '/properties'
      path: '/properties'
      fullPath: '/properties'
      preLoaderRoute: typeof PropertiesRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/dashboard/': {
      id: '/dashboard/'
      path: '/'
      fullPath: '/dashboard/'
      preLoaderRoute: typeof DashboardIndexRouteImport
      parentRoute: typeof DashboardRoute
    }
    '/dashboard/$': {
      id: '/dashboard/$'
      path: '/$'
      fullPath: '/dashboard/$'
      preLoaderRoute: typeof DashboardSplatRouteImport
      parentRoute: typeof DashboardRoute
    }
  }
}

interface DashboardRouteChildren {
  DashboardSplatRoute: typeof DashboardSplatRoute
  DashboardIndexRoute: typeof DashboardIndexRoute
}

const DashboardRouteChildren: DashboardRouteChildren = {
  DashboardSplatRoute: DashboardSplatRoute,
  DashboardIndexRoute: DashboardIndexRoute,
}

const DashboardRouteWithChildren = DashboardRoute._addFileChildren(
  DashboardRouteChildren,
)

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  ContactRoute: ContactRoute,
  DashboardRoute: DashboardRouteWithChildren,
  LoginRoute: LoginRoute,
  PropertiesRoute: PropertiesRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
    config: Awaited<ReturnType<typeof startInstance.getOptions>>
  }
}
