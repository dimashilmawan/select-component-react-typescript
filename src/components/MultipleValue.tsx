import { SelectOption } from "./Select";

type ValueProps = {
	onSelectOption: (v: SelectOption) => void;
	value: SelectOption;
};

const MultipleValue = ({ value, onSelectOption }: ValueProps) => {
	return (
		<button
			className="group flex items-center gap-2 rounded-md bg-indigo-500 px-2 py-1 font-mono text-white  outline-none  hover:scale-105 hover:bg-red-400 hover:text-white focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
			key={value?.value}
			onClick={e => {
				e.stopPropagation();
				onSelectOption(value);
			}}
		>
			{value?.label}
			<span
				className={`-translate-y-[1px] p-0 outline-none group-hover:text-white `}
			>
				&times;
			</span>
		</button>
	);
};
export default MultipleValue;
