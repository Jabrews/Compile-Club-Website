import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? window.location.origin; // e.g. https://api.compile-club.org

const getCookie = (name: string) => {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : '';
};

async function ensureCsrf() {
  if (!getCookie('csrftoken')) {
    await fetch(`${API_BASE}/api/csrf/`, { credentials: 'include' }); // sets csrftoken cookie
  }
}

export default function useHandleRequest() {
  const navigate = useNavigate();

  const submitForm = useMutation({
    mutationFn: async (payload: { hearFormChoice: string; name: string }) => {
      // 1) make sure we have a CSRF cookie
      await ensureCsrf();

      // 2) send POST with token
      let token = getCookie('csrftoken');
      let res = await fetch(`${API_BASE}/api/submit_user_info_form/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': token,
        },
        body: JSON.stringify(payload),
      });

      // 3) if CSRF failed (e.g., rotated), refresh and retry once
      if (res.status === 403) {
        await fetch(`${API_BASE}/api/csrf/`, { credentials: 'include' });
        token = getCookie('csrftoken');
        res = await fetch(`${API_BASE}/api/submit_user_info_form/`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': token,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    onSuccess: () => navigate('/server'),
  });

  const handleRequest = (hearLocation: string, name: string) =>
    submitForm.mutate({ hearFormChoice: hearLocation, name });

  return { handleRequest, isLoading: submitForm.isPending, error: submitForm.error };
}
