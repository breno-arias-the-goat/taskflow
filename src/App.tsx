import { Route, Switch } from 'wouter'
import AuthPage from '@/pages/AuthPage'
import AppPage  from '@/pages/AppPage'
import { ProtectedRoute, PublicRoute } from '@/components/ProtectedRoute'

export default function App() {
  return (
    <Switch>
      <Route path="/auth">
        <PublicRoute><AuthPage /></PublicRoute>
      </Route>
      <Route path="/">
        <ProtectedRoute><AppPage /></ProtectedRoute>
      </Route>
    </Switch>
  )
}
