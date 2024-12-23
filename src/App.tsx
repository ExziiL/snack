import ArticleForm from "./components/forms/ArticleForm";
import StoreForm from "./components/forms/StoreForm";
import { useArticles } from "./queries/useArticles";
import { useStores } from "./queries/useStores";

function App() {
	const { data: stores, error, isPending } = useStores();
	const { data: articles, error: articleError, isPending: articleIsPending } = useArticles();

	if (isPending || articleIsPending) return <div>...Loading</div>;
	if (error || articleError) return error?.message;

	return (
		<div className="flex gap-4">
			<div className="flex flex-col gap-4">
				<div>
					{stores?.map((store: any) => (
						<li key={store.name}>{store.name}</li>
					))}
				</div>
				<StoreForm />
			</div>
			<div className="flex flex-col gap-4">
				<div>
					{articles?.map((article: any) => {
						return (
							<li key={article.id}>
								{article.name} - {article.store?.name || "Unknown store"} - {article.price}
							</li>
						);
					})}
				</div>
				<ArticleForm />
			</div>
		</div>
	);
}

export default App;
