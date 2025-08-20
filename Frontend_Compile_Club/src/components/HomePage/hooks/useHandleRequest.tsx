import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? window.location.origin;

const getCookie = (name: string) => {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : '';
};

async function ensureCsrf() {
  if (!getCookie('csrftoken')) {
    await fetch(`${API_BASE}/api/csrf/`, { credentials: 'include' });
  }
}

type Payload = { hearFormChoice: string; name: string };

export default function useHandleRequest() {
  const navigate = useNavigate();

  const submitForm = useMutation({
    mutationFn: async (payload: Payload) => {
      await ensureCsrf();

      const doPost = async () => {
        const res = await fetch(`${API_BASE}/api/submit_user_info_form/`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
          },
          body: JSON.stringify(payload),
        });
        return res;
      };

      let res = await doPost();

      // retry once if CSRF page (HTML) came back
      if (res.status === 403 && !res.headers.get('content-type')?.includes('application/json')) {
        await fetch(`${API_BASE}/api/csrf/`, { credentials: 'include' });
        res = await doPost();
      }

      if (!res.ok) {
        // try to pull JSON error message (e.g., duplicate 409)
        let message = `HTTP ${res.status}`;
        if (res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json().catch(() => null);
          if (data?.error) message = data.error;
        }
        const err = new Error(message) as Error & { status?: number };
        err.status = res.status;
        throw err;
      }

      return res.json();
    },
    onSuccess: () => navigate('/server'),
  });

  const handleRequest = (hearLocation: string, name: string) =>
    submitForm.mutate({ hearFormChoice: hearLocation, name });

  const status = (submitForm.error as (Error & { status?: number }) | null)?.status ?? null;
  const isDuplicate = status === 409; // backend returns 409 for "already submitted"
  const errorFound = submitForm.isError; // simple boolean

  return {
    handleRequest,
    isLoading: submitForm.isPending,
    errorFound,
    isDuplicate,
    errorMessage: (submitForm.error as Error | null)?.message ?? null,
  };
}
