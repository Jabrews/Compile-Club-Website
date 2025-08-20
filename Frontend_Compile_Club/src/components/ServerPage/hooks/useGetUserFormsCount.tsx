import { useQuery } from '@tanstack/react-query';

type UserInfoForm = {
  hearFormChoice: string;
  name: string;
  created_at: string;
  ip_address: string | null;
};

export function useGetUserFormsCount() {
  return useQuery({
    queryKey: ['userInfoForms'],
    queryFn: async () => {
      const res = await fetch('/api/get_user_info_forms/', {  // ← note trailing slash
        // ensure NO auth header is added by your wrapper
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<{count:number; data: UserInfoForm[]}>;
    },
    staleTime: 30_000,
  });
}
