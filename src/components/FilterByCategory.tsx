import { ChangeEvent } from 'react';
import { categories } from '../data/categories';
import { useBudget } from '../hooks/useBudget';

export default function FilterByCategory() {
	const { dispatch } = useBudget();

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		dispatch({
			type: 'add-filter-category',
			payload: { id: e.target.value }
		});
	};

	return (
		<div className="bg-white shadow-md rounded-lg p-10">
			<form action="">
				<div className="flex flex-col md:flex">
					<label htmlFor="category">Filtrar Gastos</label>
					<select
						id="category"
						className="bg-slate-100 p-3 flex-1 rounded"
						onChange={handleChange}
					>
						<option value="">Todas las categorias</option>
						{categories.map(category => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</div>
			</form>
		</div>
	);
}
