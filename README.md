# React Wrapper for [Flatpickr.js](https://github.com/flatpickr/flatpickr)

This package provides a React wrapper for the popular date and time picker library, Flatpickr.js. It allows you to easily integrate Flatpickr into your React applications with a variety of customizable options and hooks with typescript support and fully tested functionality.

## Installation

To install the package, use npm or yarn:

```bash
npm install flatpickr flatpickr-react
```

or

```bash
yarn add flatpickr flatpickr-react
```

## Usage

### Basic Usage

To use the `DateTimePicker` component, import it into your React component and include it in your JSX:

```jsx
import React, { useState } from "react";
import DateTimePicker from "flatpickr-react";
import "flatpickr/dist/flatpickr.css";

function App() {
	const [date, setDate] = (useState < Date) | (null > null);

	return (
		<div>
			<DateTimePicker
				options={{
					dateFormat: "Y-m-d",
				}}
				value={date}
				onChange={(selectedDate: Date) => {
					setDate(selectedDate);
				}}
			/>
			<p>Selected Date: {date ? date.toString() : "None"}</p>
		</div>
	);
}

export default App;
```

### Props

The `DateTimePicker` component accepts the following props:

- `defaultValue`: The default value of the input.
- `options`: Flatpickr options object.
- `locale`: Locale settings for Flatpickr.
- `plugins`: Array of Flatpickr plugins.
- `onChange`: Callback function for the `onChange` event.
- `onOpen`: Callback function for the `onOpen` event.
- `onClose`: Callback function for the `onClose` event.
- `onMonthChange`: Callback function for the `onMonthChange` event.
- `onYearChange`: Callback function for the `onYearChange` event.
- `onReady`: Callback function for the `onReady` event.
- `onValueUpdate`: Callback function for the `onValueUpdate` event.
- `onDayCreate`: Callback function for the `onDayCreate` event.
- `value`: The current value of the input.
- `className`: Custom class name for the input.
- `children`: Custom children elements.
- `render`: Custom render function for the input.
- `onCreate`: Callback function for when the Flatpickr instance is created.
- `onDestroy`: Callback function for when the Flatpickr instance is destroyed.

### Examples

#### Example 1: Basic Date Picker

```jsx
<DateTimePicker
	options={{
		dateFormat: "Y-m-d",
	}}
/>
```

#### Example 2: Date and Time Picker

```jsx
<DateTimePicker
	options={{
		enableTime: true,
		dateFormat: "Y-m-d H:i",
	}}
/>
```

#### Example 3: Range Picker

```jsx
<DateTimePicker
	options={{
		mode: "range",
		dateFormat: "Y-m-d",
	}}
/>
```

#### Example 4: Multiple Dates Picker

```jsx
<DateTimePicker
	options={{
		mode: "multiple",
		dateFormat: "Y-m-d",
	}}
/>
```

#### Example 5: Custom Locale

```jsx
import { Spanish } from "flatpickr/dist/l10n/es";

<DateTimePicker
	options={{
		dateFormat: "Y-m-d",
	}}
	locale={Spanish}
/>;
```

#### Example 6: Custom Render Function

```jsx
<DateTimePicker
	render={(props, ref) => (
		<div className="custom-wrapper">
			<label>Select Date:</label>
			<button {...props} ref={ref}>
				Pick a date
			</button>
		</div>
	)}
/>
```

#### Example 7: Event Callbacks

```jsx
<DateTimePicker
	onOpen={() => console.log("Opened")}
	onClose={() => console.log("Closed")}
	onChange={(selectedDates) => console.log("Date changed", selectedDates)}
	onMonthChange={(selectedDates, dateStr, instance) => console.log("Month changed")}
	onYearChange={(selectedDates, dateStr, instance) => console.log("Year changed")}
	onReady={(selectedDates, dateStr, instance) => console.log("Ready")}
	onValueUpdate={(selectedDates, dateStr, instance) => console.log("Value updated")}
	onDayCreate={(selectedDates, dateStr, instance, dayElement) => console.log("Day created")}
/>
```

#### Example 8: Custom Position

```jsx
<DateTimePicker
	options={{
		position: "top",
	}}
/>
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or feature requests.

## Acknowledgements

- [Flatpickr.js](https://flatpickr.js.org/)
- [React](https://reactjs.org/)

---

Feel free to customize the README file further to match your specific needs and preferences.
