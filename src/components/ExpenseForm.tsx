import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import DatePicker from 'react-date-picker';

import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import { categories } from '../data/categories';
import { DraftExpense, Value } from '../types';
import ErrorMessage from './ErrorMessage';
import { useBudget } from '../hooks/useBudget';

export default function ExpenseForm() {
	const [error, setError] = useState('');
	const [expense, setExpense] = useState<DraftExpense>({
		amount: 0,
		expenseName: '',
		category: '',
		date: new Date()
	});
	const [previousAmount, setPreviousAmount] = useState(0);

	const { state, dispatch, remainingBudget } = useBudget();

	useEffect(() => {
		if (state.editingId) {
			const editingExpense = state.expenses.filter(
				expense => expense.id === state.editingId
			)[0];
			setPreviousAmount(editingExpense.amount)
			setExpense(editingExpense);
		}
	}, [state.editingId]);

	const handleChangeDate = (value: Value) => {
		setExpense({
			...expense,
			date: value
		});
	};

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		const isAmountField = ['amount'].includes(name);
		setExpense({
			...expense,
			[name]: isAmountField ? Number(value) : value
		});
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validar
		if (Object.values(expense).includes('')) {
			setError('Todos los campos son obligatorios');
			return;
		}

		// Validar
		if ((expense.amount - previousAmount) > remainingBudget) {
			setError('Presupuesto excedido.');
			return;
		}

		// Agregar o actualizarun gasto
		if (state.editingId) {
			dispatch({
				type: 'update-expense',
				payload: { expense: { ...expense, id: state.editingId } }
			});
		} else {
			dispatch({ type: 'add-expense', payload: { expense } });
		}

		// Limpiamos el formulario
		setExpense({
			amount: 0,
			expenseName: '',
			category: '',
			date: new Date()
		});
	};

	return (
		<form className="space-y-5" onSubmit={handleSubmit}>
			<legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
				{state.editingId ? 'Guardar cambios' : 'Nuevo gasto'}
			</legend>

			{error && <ErrorMessage> {error} </ErrorMessage>}

			<div className="flex flex-col gap-2">
				<label htmlFor="expenseName" className="text-xl">
					Nombre gasto:
				</label>
				<input
					type="text"
					id="expenseName"
					name="expenseName"
					placeholder="Añade el nombre del gasto"
					className="bg-slate-100  p-2"
					value={expense.expenseName}
					onChange={handleChange}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="amount" className="text-xl">
					Cantidad:
				</label>
				<input
					type="number"
					id="amount"
					name="amount"
					placeholder="Añade la cantidad del gasto: ej. 300"
					className="bg-slate-100  p-2"
					value={expense.amount}
					onChange={handleChange}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="amount" className="text-xl">
					Categoría:
				</label>
				<select
					id="category"
					name="category"
					className="bg-slate-100  p-2"
					value={expense.category}
					onChange={handleChange}
				>
					<option value="">Seleccione</option>
					{categories.map(category => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</select>
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="amount" className="text-xl">
					Fecha Gasto:
				</label>
				<DatePicker
					className="bg-slate-100 p=2 border-0"
					value={expense.date}
					onChange={handleChangeDate}
				/>
			</div>
			<input
				type="submit"
				className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
				value={state.editingId ? 'Guardar cambios' : 'Registrar gasto'}
			/>
		</form>
	);
}
