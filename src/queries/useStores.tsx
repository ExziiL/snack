import { Store } from "@/types/Store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createStore, fetchStores } from "../api/stores";

const STORES_KEY = ["stores"];

export function useStores() {
	return useQuery({
		queryKey: STORES_KEY,
		queryFn: fetchStores,
	});
}

export function useCreateStore() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (store: Store) => createStore(store),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: STORES_KEY,
			});
		},
	});
}
