import { Navigate } from 'react-router-dom'
import { useAuth } from '../utilities/Auth.Context'


// eslint-disable-next-line react/prop-types
const SecureRoute = ({ element }) => {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }


    return (
        <>
            {element}
        </>
    )
}




export default SecureRoute