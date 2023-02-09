import { useEffect, useRef, useState } from "react";

const classes = {
	container: `relative flex items-center gap-2 rounded-lg ring-2 ring-gray-400 p-2 outline-none focus:ring-2 focus:ring-indigo-300`,
	value: `flex-1 flex flex-wrap gap-x-3 gap-y-2 capitalize text-gray-600 font-semibold`,
	buttonClear: `border-none bg-none  p-0 outline-none text-xl font-semibold text-gray-400 focus:ring-2 focus:ring-red-400 focus:text-red-400`,
	divider: `w-[2px] self-stretch bg-gray-400`,
	caret: `translate-y-1/2 border-[6px] border-transparent border-t-gray-400`,
	options: `absolute max-h-40 overflow-y-auto top-[calc(100%_+_10px)] left-0  w-full text-gray-600 capitalize  rounded-lg z-50 bg-indigo-50 ring-1 ring-gray-400`,
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
	const containerRef = useRef<HTMLDivElement>(null);
	const optionsRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		if (isOpen) {
			setHighlightedIndex(0);
		}
	}, [isOpen]);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.target !== containerRef.current) return;
			switch (e.code) {
				case "Enter":
				case "Space":
					setIsOpen(prevState => !prevState);
					if (isOpen) selectOption(options[highlightedIndex]);
					break;

				case "ArrowUp":
				case "ArrowDown": {
					if (!isOpen) {
						setIsOpen(true);
						break;
					}

					const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
					if (newValue >= 0 && newValue < options.length) {
						setHighlightedIndex(newValue);

						const selectedOption = optionsRef.current?.querySelector(
							`.INDEX---${newValue}`
						);
						selectedOption?.scrollIntoView({
							behavior: "auto",
							block: "nearest",
						});
					}
					break;
				}

				case "Escape":
					setIsOpen(false);
					break;
			}
		};
		containerRef.current?.addEventListener("keydown", handler);

		return () => {
			containerRef.current?.removeEventListener("keydown", handler);
		};
	}, [isOpen, options, highlightedIndex]);

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

		setIsOpen(prevState => !prevState);
	};

	const isOptionSelected = (option: SelectOption) => {
		return multiple ? value.includes(option) : option === value;
	};

	return (
		<div
			ref={containerRef}
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
									className="group flex items-center gap-2 rounded-md bg-indigo-500 px-2 py-1 font-mono text-white  outline-none  hover:scale-105 hover:bg-red-400 hover:text-white focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
									key={v.value}
									onClick={e => {
										e.stopPropagation();
										selectOption(v);
									}}
								>
									{v.label}
									<span
										className={`-translate-y-[1px] p-0 outline-none group-hover:text-white `}
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
			<ul
				ref={optionsRef}
				className={`${classes.options} ${isOpen ? "block" : "hidden"}`}
			>
				{options.map((option, index) => {
					return (
						<li
							className={`p-2 ${`INDEX---${index}`} ${
								isOptionSelected(option) ? "bg-indigo-500 text-white" : ""
							}
							${highlightedIndex === index ? "active bg-indigo-400 text-white " : ""}
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
