import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateStore, useStores } from "../../queries/useStores";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
	store: z.object({
		name: z.string().min(2, {
			message: "Store name must be at least 2 characters.",
		}),
	}),
});

function StoreForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			store: {
				name: "",
			},
		},
	});

	const { toast } = useToast();
	const { data: stores } = useStores();
	const { mutate: mutateStore } = useCreateStore();

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		const existingStore = stores?.find(
			(s) => s.name.toLowerCase() === values.store.name.toLowerCase()
		);

		if (existingStore) {
			toast({
				title: "Store already exists",
				description: "The store already exists.",
				variant: "destructive",
			});
			return;
		}

		mutateStore(values.store);
		form.reset();
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8"
			>
				<FormField
					control={form.control}
					name="store"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Einkaufsladen</FormLabel>
							<FormControl>
								<Input
									{...field}
									value={field.value.name}
									onChange={(e) =>
										field.onChange({
											...field.value,
											name: e.target.value,
										})
									}
									placeholder="Kaufland, Edeka, Rewe..."
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">Submit</Button>
			</form>
		</Form>
		// <form
		// 	className="flex flex-col gap-2 w-fit"
		// 	onSubmit={handleSubmit}
		// >
		// 	<label htmlFor="storeInput">Store:</label>
		// 	<input
		// 		id="storeInput"
		// 		type="text"
		// 		className="border"
		// 	/>
		// 	<button
		// 		type="submit"
		// 		className="border"
		// 	>
		// 		Create
		// 	</button>
		// </form>
	);
}

export default StoreForm;
