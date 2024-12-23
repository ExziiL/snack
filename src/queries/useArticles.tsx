import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createArticle, fetchArticles } from "../api/articles";

const ARTICLES_KEY = ["articles"];

export function useArticles() {
	return useQuery({
		queryKey: ARTICLES_KEY,
		queryFn: fetchArticles,
	});
}

export function useCreateArticle() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ name, store_id, price }: { name: string; store_id: string; price?: number }) => {
			return createArticle(name, store_id, price);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ARTICLES_KEY }),
	});
}
