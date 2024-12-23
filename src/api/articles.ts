import supabase from "../supabaseClient";
import { Article } from "../types/Article";

export async function fetchArticleById(id: string): Promise<Article> {
	const { data, error } = await supabase.from("articles").select("*").eq("id", id).single();

	if (error) throw error;
	return data;
}

export async function fetchArticles(): Promise<Article[]> {
	const { data, error } = await supabase.from("articles").select(
		`
			*,
			store:store_id (
				name
			)
		`
	);

	if (error) throw error;

	return data;
}

export async function createArticle(name: string, store_id: string, price?: number) {
	const { error } = await supabase.from("articles").insert({ name, store_id, price });

	if (error) throw error;
}
