import { BrowserRouter } from 'react-router-dom'
import { AlertComponent } from './components/AlertComponent';
import { HeaderComponent } from './components/HeaderComponent';
import { BrowserRoutes } from './Routes'

function App() {
  const routes = BrowserRoutes()

  return (
      <BrowserRouter>
        <AlertComponent />
        <HeaderComponent />
        { routes }
      </BrowserRouter>
  );
}

export default App;