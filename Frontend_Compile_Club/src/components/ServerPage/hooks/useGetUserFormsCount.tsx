import { useQuery } from '@tanstack/react-query';

type UserInfoForm = {
  hearFormChoice: string;
  name: string;
  created_at: string;
  ip_address: string | null;
};

// if your API returns { count, data }
type ApiResponse = {
  count: number;
  data: UserInfoForm[];
};

export function useGetUserFormsCount() {
  return useQuery({
    queryKey: ['userInfoForms'],
    queryFn: async (): Promise<ApiResponse> => {
      const res = await fetch('/api/get_user_info_forms', {
        // include credentials only if you’re using session auth/cookies:
        // credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    staleTime: 30_000,
  });
}
