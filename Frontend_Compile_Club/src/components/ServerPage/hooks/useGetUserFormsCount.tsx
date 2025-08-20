import { useQuery } from '@tanstack/react-query';


export function useGetUserFormsCount() {
  return useQuery({
    queryKey: ['userInfoForms'],
    queryFn: async () => {
      const res = await fetch('https://compile-club.org/api/get_user_info_forms/', { 
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<{count:number}>;
    },
    staleTime: 30_000,
  });
}
