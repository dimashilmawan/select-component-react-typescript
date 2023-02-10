import { useEffect, useRef, useState } from "react";
import MultipleValue from "./MultipleValue";
import Value from "./MultipleValue";

export type SelectOption = {
	label: string;
	value: number | string;
};

export type SingleSelectProps = {
	multiple?: false;
	value?: SelectOption;
	onChange: (value: SelectOption | undefined) => void;
};

export type MultipleSelectProps = {
	multiple: true;
	value: SelectOption[];
	onChange: (value: SelectOption[]) => void;
};

export type SelectProps = {
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

	const valueContent = multiple
		? value?.map((v: SelectOption) => {
				return (
					<MultipleValue
						onSelectOption={selectOption}
						key={v.value}
						value={v}
					/>
				);
		  })
		: value?.label;
	return (
		<div
			ref={containerRef}
			onClick={() => setIsOpen(prevState => !prevState)}
			onBlur={() => setIsOpen(false)}
			tabIndex={0}
			className={`relative flex items-center gap-2 rounded-lg p-2 outline-none ring-2 ring-gray-400 focus:ring-2 focus:ring-indigo-300`}
		>
			<span
				className={`flex flex-1 flex-wrap gap-x-3 gap-y-2 font-semibold capitalize text-gray-600`}
			>
				{valueContent}
			</span>
			<button
				onClick={e => {
					e.stopPropagation();
					clearOptions();
				}}
				className={`border-none bg-none  p-0 text-xl font-semibold text-gray-400 outline-none focus:text-red-400 focus:ring-2 focus:ring-red-400`}
			>
				&times;
			</button>
			<div className={`w-[2px] self-stretch bg-gray-400`} />
			<div
				className={`translate-y-1/2 border-[6px] border-transparent border-t-gray-400`}
			/>
			<ul
				ref={optionsRef}
				className={`absolute top-[calc(100%_+_10px)] left-0 z-50 max-h-40  w-full overflow-y-auto rounded-lg  bg-indigo-50 capitalize text-gray-600 ring-1 ring-gray-400 ${
					isOpen ? "block" : "hidden"
				}`}
			>
				{options.map((option, index) => {
					return (
						<li
							className={`p-2 ${`INDEX---${index}`} ${
								isOptionSelected(option) ? "bg-indigo-500 text-white" : ""
							}
							${highlightedIndex === index ? "active !bg-indigo-400  text-white " : ""}
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
