import { Navigate, Outlet } from 'react-router'

type Props = {
  authed: boolean
  path?: string
}

export const PrivateRoute = ({ authed, path }: Props) => {
  const link = path ? '/login/redirect/' + path : '/login'
  return authed ? <Outlet /> : <Navigate to={link} replace />
}
