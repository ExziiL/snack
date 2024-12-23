import supabase from "../supabaseClient";
import { Store } from "../types/Store";

export async function fetchStore(id: string): Promise<Store> {
	const { data, error } = await supabase.from("stores").select("*").eq("id", id).single();

	if (error) throw error;
	return data;
}

export async function fetchStores(): Promise<Store[]> {
	const { data, error } = await supabase.from("stores").select();

	if (error) throw error;
	return data;
}

export async function createStore(store: Store) {
	const { data, error } = await supabase.from("stores").insert(store).select().single();

	if (error) throw error;
	return data;
}
