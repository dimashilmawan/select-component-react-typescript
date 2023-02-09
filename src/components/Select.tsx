import { useEffect, useState } from "react";

const classes = {
	container: `relative flex items-center gap-2 rounded-lg border-2 border-indigo-300 p-2 outline-none focus:ring-2`,
	value: `flex-1 flex flex-wrap gap-x-3 gap-y-2`,
	buttonClear: `border-none bg-none p-0 outline-none focus:ring-2`,
	divider: `w-[2px] self-stretch bg-black`,
	caret: `translate-y-1/2 border-[6px] border-transparent border-t-black`,
	options: `absolute top-[calc(100%_+_10px)] left-0 max-h-40 w-full overflow-y-auto rounded-lg z-50 bg-indigo-100`,
};

export type SelectOption = {
	label: string;
	value: number | string;
};

type SingleSelectProps = {
	multiple?: false;
	value?: SelectOption;
	onChange: (value: SelectOption | undefined) => void;
};

type MultipleSelectProps = {
	multiple: true;
	value: SelectOption[];
	onChange: (value: SelectOption[]) => void;
};

type SelectProps = {
	options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

const Select = ({ multiple, value, options, onChange }: SelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(0);

	useEffect(() => {
		if (isOpen) {
			setHighlightedIndex(0);
		}
	}, [isOpen]);

	const clearOptions = () => {
		multiple ? onChange([]) : onChange(undefined);
	};

	const selectOption = (option: SelectOption) => {
		if (multiple) {
			if (value.includes(option)) {
				onChange(value.filter(o => o !== option));
			} else {
				onChange([...value, option]);
			}
		} else {
			if (option !== value) onChange(option);
		}
	};

	const isOptionSelected = (option: SelectOption) => {
		return multiple ? value.includes(option) : option === value;
	};

	return (
		<div
			onClick={() => setIsOpen(prevState => !prevState)}
			onBlur={() => setIsOpen(false)}
			tabIndex={0}
			className={classes.container}
		>
			<span className={classes.value}>
				{multiple
					? value.map(v => {
							return (
								<button
									className="group flex items-center gap-2 rounded-md px-2 py-1 font-mono text-gray-700 outline-none ring-2 ring-gray-400 hover:scale-110 hover:bg-red-400 hover:text-white"
									key={v.value}
									onClick={e => {
										e.stopPropagation();
										selectOption(v);
									}}
								>
									{v.label}
									<span
										className={`-translate-y-[1px] p-0 outline-none group-hover:text-white`}
									>
										&times;
									</span>
								</button>
							);
					  })
					: value?.label}
			</span>
			<button
				onClick={e => {
					e.stopPropagation();
					clearOptions();
				}}
				className={classes.buttonClear}
			>
				&times;
			</button>
			<div className={classes.divider} />
			<div className={classes.caret} />
			<ul className={`${classes.options} ${isOpen ? "block" : "hidden"}`}>
				{options.map((option, index) => {
					return (
						<li
							className={`p-2 ${
								isOptionSelected(option) ? "bg-indigo-500 text-white" : ""
							}
							${highlightedIndex === index ? "bg-indigo-300" : ""}
							`}
							onMouseEnter={() => setHighlightedIndex(index)}
							onClick={e => {
								e.stopPropagation();
								selectOption(option);
							}}
							key={option.value}
						>
							{option.label}
						</li>
					);
				})}
			</ul>
		</div>
	);
};
export default Select;
