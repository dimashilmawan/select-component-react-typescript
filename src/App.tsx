import { useState } from "react";
import Select, { SelectOption } from "./components/Select";

const options = [
	{ label: "one", value: 10 },
	{ label: "two", value: 20 },
	{ label: "three", value: 30 },
	{ label: "second", value: 2 },
	{ label: "third", value: 3 },
	{ label: "fourth", value: 4 },
	{ label: "fifth", value: 5 },
];

function App() {
	const [value1, setValue1] = useState<SelectOption[]>([]);
	const [value2, setValue2] = useState<SelectOption | undefined>(options[0]);
	return (
		<div className="mx-auto max-w-xs pt-20">
			<Select
				multiple
				options={options}
				value={value1}
				onChange={o => setValue1(o)}
			/>
			<br />
			<Select options={options} value={value2} onChange={o => setValue2(o)} />
		</div>
	);
}

export default App;
