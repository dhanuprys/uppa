import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import BootPage from '../pages/BootPage';

const routes = createBrowserRouter([
    {
        path: '/',
        element: <BootPage />
    },
    {
        path: '/main',
        element: <MainPage />
    }
]);

function AppRoutes() {
    return (
        <RouterProvider router={routes} />
    );
}

export default AppRoutes;