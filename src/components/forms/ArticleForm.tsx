import { useToast } from "@/hooks/use-toast";
import { useArticles, useCreateArticle } from "@/queries/useArticles";
import { Store } from "@/types/Store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateStore, useStores } from "../../queries/useStores";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
	article: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	price: z.coerce.number().min(0),
	store: z.object({
		name: z.string().min(2, {
			message: "Store must be at least 2 characters",
		}),
		id: z.string().optional(),
	}),
});

function ArticleForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			article: "",
			store: { name: "", id: undefined },
			price: 0,
		},
	});

	const { toast } = useToast();

	const { mutate: createArticle } = useCreateArticle();
	const { mutate: createStore } = useCreateStore();
	const { data: stores } = useStores();
	const { data: articles } = useArticles();

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const { article, store, price } = values;

			const existingArticle = articles?.find((a) => a.name.toLowerCase() === article.toLowerCase());
			if (existingArticle) {
				toast({
					title: "Article already exists",
					description: "The article already exists.",
					variant: "default",
				});
				return;
			}

			let storeId = store.id;
			const existingStore = stores?.find((s) => s.name.toLowerCase() === store.name.toLowerCase());

			if (existingStore) {
				storeId = existingStore.id;
			} else {
				const newStore = await new Promise<Store>((resolve, reject) => {
					createStore(
						{ name: store.name },
						{
							onSuccess: (data) => resolve(data),
							onError: (error) => reject(error),
						}
					);
				});
				storeId = newStore.id;
			}

			createArticle({
				name: article,
				store_id: storeId || "",
				price,
			});

			form.reset();

			toast({
				title: "Article created",
				description: "The article was successfully created.",
			});
		} catch (error) {
			console.error("Error creating article: ", error);

			toast({
				title: "Error creating article",
				description: "An error occurred while creating the article.",
				variant: "destructive",
			});
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8"
			>
				<FormField
					control={form.control}
					name="article"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Artikel:</FormLabel>
							<FormControl>
								<Input
									placeholder="Cola Zero, Maoams..."
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="store"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Store:</FormLabel>
							<FormControl>
								<Input
									{...field}
									value={field.value.name}
									placeholder="Rewe, Aldi..."
									onChange={(e) =>
										field.onChange({
											...field.value,
											name: e.target.value,
										})
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="price"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Preis:</FormLabel>
							<FormControl>
								<Input
									type="number"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}

export default ArticleForm;
