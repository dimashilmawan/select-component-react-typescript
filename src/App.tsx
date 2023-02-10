import { useState } from "react";
import Select, { SelectOption } from "./components/Select";

const options = [
	{ label: "one", value: 10 },
	{ label: "two", value: 20 },
	{ label: "three", value: 30 },
	{ label: "fourth", value: 2 },
	{ label: "fifth", value: 3 },
	{ label: "sixth", value: 4 },
	{ label: "seventh", value: 5 },
];

function App() {
	const [value1, setValue1] = useState<SelectOption[]>([]);
	const [value2, setValue2] = useState<SelectOption | undefined>(options[0]);
	return (
		<div className="mx-auto max-w-xs pt-20">
			<h1
				className="mb-2 text-2xl font-semibold text-gray-700
			"
			>
				MultiSelect
			</h1>
			<Select
				multiple
				options={options}
				value={value1}
				onChange={o => setValue1(o)}
			/>
			<br />
			<h1
				className="mb-2 text-2xl font-semibold text-gray-700
			"
			>
				Single Select
			</h1>
			<Select
				multiple={false}
				options={options}
				value={value2}
				onChange={o => setValue2(o)}
			/>
		</div>
	);
}

export default App;
