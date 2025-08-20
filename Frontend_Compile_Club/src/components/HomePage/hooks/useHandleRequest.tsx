import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

  // simple flags you can read in HomePage
  const [errorFound, setErrorFound] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submitForm = useMutation({
    retry: false,
    throwOnError: false, // prevent bubbling to error boundaries
    mutationFn: async (payload: Payload) => {
      await ensureCsrf();

      const doPost = async () =>
        fetch(`${API_BASE}/api/submit_user_info_form/`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
          },
          body: JSON.stringify(payload),
        });

      let res = await doPost();

      // retry once if CSRF page (HTML) showed up
      if (res.status === 403 && !res.headers.get('content-type')?.includes('application/json')) {
        await fetch(`${API_BASE}/api/csrf/`, { credentials: 'include' });
        res = await doPost();
      }

      if (!res.ok) {
        // parse JSON error if present
        let msg = `HTTP ${res.status}`;
        let isDup = false;
        if (res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json().catch(() => null);
          if (data?.error) msg = data.error;
        }
        if (res.status === 409) isDup = true; // "already submitted" case
        // instead of throw, set flags and return a rejected-like result
        setErrorFound(true);
        setIsDuplicate(isDup);
        setErrorMessage(msg);
        // tell React Query it's an error state
        throw new Error(msg);
      }

      // clear flags on success
      setErrorFound(false);
      setIsDuplicate(false);
      setErrorMessage(null);

      return res.json();
    },
    onSuccess: () => navigate('/server'),
    onError: () => {
      // flags already set above; nothing else needed
    },
  });

  const handleRequest = (hearLocation: string, name: string) =>
    submitForm.mutate({ hearFormChoice: hearLocation, name });

  return {
    handleRequest,
    isLoading: submitForm.isPending,
    errorFound,         // <- boolean
    isDuplicate,        // <- boolean for 409 duplicate
    errorMessage,       // <- string to show user
  };
}
