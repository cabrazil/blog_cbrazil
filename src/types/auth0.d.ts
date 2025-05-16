declare module '@auth0/nextjs-auth0' {
  import { NextPage } from 'next'
  import { GetServerSideProps } from 'next'
  import { NextApiHandler } from 'next'
  import { ReactNode } from 'react'

  export interface User {
    sub: string
    name?: string
    email?: string
    picture?: string
    [key: string]: any
  }

  export interface UserContext {
    user?: User
    error?: Error
    isLoading: boolean
  }

  export function useUser(): UserContext

  export function withPageAuthRequired<P extends { [key: string]: any } = { [key: string]: any }>(
    options?: {
      returnTo?: string
      getServerSideProps?: GetServerSideProps<P>
    }
  ): (component: NextPage<P>) => NextPage<P>

  export function initAuth0(config: {
    secret: string
    issuerBaseURL: string
    baseURL: string
    clientID: string
    clientSecret: string
    routes?: {
      callback?: string
      login?: string
      logout?: string
    }
    authorizationParams?: {
      response_type?: string
      scope?: string
    }
    session?: {
      rollingDuration?: number
      absoluteDuration?: number
    }
  }): {
    handleAuth: () => NextApiHandler
    handleCallback: () => NextApiHandler
    handleLogin: () => NextApiHandler
    handleLogout: () => NextApiHandler
    getSession: (req: any, res: any) => Promise<any>
    withApiAuthRequired: (handler: NextApiHandler) => NextApiHandler
    withPageAuthRequired: (handler: any) => any
  }

  export interface UserProviderProps {
    children: ReactNode
    user?: User
  }

  export function UserProvider(props: UserProviderProps): JSX.Element
} 