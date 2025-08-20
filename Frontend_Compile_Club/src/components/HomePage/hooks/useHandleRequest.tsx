import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

// helper: read csrftoken cookie (if you enabled CSRF on the endpoint)
const getCookie = (name: string) =>
  document.cookie.split('; ').find(r => r.startsWith(name + '='))?.split('=')[1] ?? '';

export default function useHandleRequest() {
  const navigate = useNavigate();

  const API_BASE = 'https://api.compile-club.org'; 

  const submitForm = useMutation({
    mutationFn: async (payload: { hearFormChoice: string; name: string }) => {
      const res = await fetch(`${API_BASE}/api/submit_user_info_form/`, {
        method: 'POST',
        credentials: 'include', // needed if using CSRF/session cookies
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'), 
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      navigate('/server'); 
    },
  });

  const handleRequest = (hearLocation: string, name: string) => {
    submitForm.mutate({ hearFormChoice: hearLocation, name });
  };

  return { handleRequest, isLoading: submitForm.isPending, error: submitForm.error };
}
