import { useNavigate } from 'react-router-dom';

export default function useHandleRequest() {

    const navigate = useNavigate();

    const handleRequest = (hearLocation : string, name : string) => {
        console.log(hearLocation, name)
        navigate('/server'); 




    }

    return handleRequest
}