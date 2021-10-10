import { render } from '@testing-library/react';
import React from 'react'
import './home.css';


function Home() {
	const [todo, setTodo] = React.useState([])
	const [current, setCurrent] = React.useState('')
	const [edit, setEdit] = React.useState(null)
	const [editText, setEditText] = React.useState('')
	const [reorder, setReorder] = React.useState(null)
	const [reorderNumber, setReorderNumber] = React.useState(null)
	const [categories, setCategories] = React.useState([])
	const [tag, setTag] = React.useState('')
	const [displayTag, setDisplayTag] = React.useState('all')

	React.useEffect(() => { //Used to load to do list from localStorage
		const temp = localStorage.getItem("dataList")
		const parsed = JSON.parse(temp)

		if (parsed) {
			setTodo(parsed)
		}
	}, [])

	// React.useEffect(() => { //Used to load categories list from localStorage
	// 	const temp = localStorage.getItem("categoryList")
	// 	const parsed = JSON.parse(temp)

	// 	if (parsed) {
	// 		setCategories(parsed)
	// 	}
	// }, [])

	React.useEffect(() => { //Used to save to do list to localStorage
		const data = JSON.stringify(todo)
		localStorage.setItem("dataList", data)
	}, [todo])

	React.useEffect(() => { //Used to save categories list to localStorage
		const tags = JSON.stringify(categories)
		localStorage.setItem("categoryList", tags)
	}, [categories])

	function handleSubmit(e) {
		e.preventDefault() //Prevents refresh on submission

		const newTodo = {
			id: new Date().getTime(),
			text: current,
			completed: false,
			tag: tag
		}

		setTodo([...todo].concat(newTodo)) //Adds new todo to Todos Array
		setCategories([...categories].concat(tag))
		setCurrent('') //Reinitialize current to make sure no mix ups
		setTag('')
	}

	//function to delete items from list
	function deleteItem(id) {
		const updated = [...todo].filter((current) => current.id !== id)
		setTodo(updated)
	}

	//function to toggle the complete status of items
	function toggleComplete(id) {
		const updated = [...todo].map((current) => {
			if (current.id === id) {
				current.completed = !current.completed
			}
			return current
		})

		setTodo(updated)
	}

	//function to edit items in the list
	function editItem(id) {
		const updated = [...todo].map((item) => {
			if (item.id === id) {
				item.text = editText
			}
			return item
		})
		setTodo(updated)
		setEdit(null)
		setEditText('')
	}

	function reorderItem(id) { //Reorders item in array
		const updated = [...todo] //create new array from todo

		updated.map((item) => {
			if (item.id === id) { //make sure correct item
				updated.splice(reorderNumber, 0, updated.splice(updated.indexOf(item), 1)[0]) //at given index, remove none, and add given item
			}
			return item
		})

		setTodo(updated)
		setReorder(null)
		setReorderNumber(null)
	}

	//Conditional Rendering to show show change input field and confirm button only
	function inputWithButton(id) {
		return (
			<div>
				<input type='text' onChange={(e) => setEditText(e.target.value)} value={editText} />
				<button onClick={() => editItem(id)}>Confirm Edit</button>
			</div>
		);
	}

	//Conditional Rendering to show show item text and edit button only
	function textWithEdit(id, text, tag) {
		return (
			<div className="list">
				{text}
				<button onClick={() => setEdit(id)}>Edit</button>
				{'Tag: ' + tag}
			</div>
		);
	}

	function inputReorder(id) {
		return (
			<div>
				<input type='number' onChange={(e) => setReorderNumber(e.target.value)} value={reorderNumber} />
				<button onClick={() => reorderItem(id)}>Enter Index</button>
			</div>
		);
	}

	function handleSelectChange(e) {
		setDisplayTag(e.target.value)
	}

	function dropdown(e) {
		return (
			<div>
				<select onChange={handleSelectChange}>
					<option value="Select a Category"> -- Select a category -- </option>
					<option value="all">All</option>

					{categories.map((item) => <option value={item}>{item}</option>)}
				</select>
			</div>
		)
	}

	return (
		<div className="home">
			{dropdown()}
			<form onSubmit={handleSubmit}>
				<input type="text" onChange={(e) => setCurrent(e.target.value)} value={current} placeholder='Text' />
				<input type="text" onChange={(e) => setTag(e.target.value)} value={tag} placeholder='Category' />

				<button type="submit">Add Item</button>
			</form>

			{/* {todo.map((item) => <div key={item.id} > */}
			{todo.filter(item => displayTag === 'all').map(filteredItem => (
				<div key={filteredItem.id} >
					{edit === filteredItem.id ? (inputWithButton(filteredItem.id)) : (textWithEdit(filteredItem.id, filteredItem.text, filteredItem.tag))}
					{reorder === filteredItem.id ? (inputReorder(filteredItem.id)) : (<button onClick={() => setReorder(filteredItem.id)}>Reorder</button>)}

					<button onClick={() => deleteItem(filteredItem.id)}>Delete</button>
					<input type='checkbox' onChange={() => toggleComplete(filteredItem.id)} checked={filteredItem.completed} />

				</div>
			))}


			{todo.filter(item => item.tag === displayTag).map(filteredItem => (
				<div key={filteredItem.id} >
					{edit === filteredItem.id ? (inputWithButton(filteredItem.id)) : (textWithEdit(filteredItem.id, filteredItem.text, filteredItem.tag))}
					{reorder === filteredItem.id ? (inputReorder(filteredItem.id)) : (<button onClick={() => setReorder(filteredItem.id)}>Reorder</button>)}

					<button onClick={() => deleteItem(filteredItem.id)}>Delete</button>
					<input type='checkbox' onChange={() => toggleComplete(filteredItem.id)} checked={filteredItem.completed} />

				</div>
			))}
		</div >
	)}


	export default Home
