import React from 'react'
import './home.css';


function Home() {
	const [todo, setTodo] = React.useState([])
	const [current, setCurrent] = React.useState('')
	const [edit, setEdit] = React.useState(null)
	const [editText, setEditText] = React.useState('')
	const [reorder, setReorder] = React.useState(null)
	const [reorderNumber, setReorderNumber] = React.useState(null)

	React.useEffect(() => { //Used to load to do list from localStorage
		const temp = localStorage.getItem("dataList")
		const parsed = JSON.parse(temp)

		if(parsed){
			setTodo(parsed)
		}
	}, [])

	React.useEffect(() => { //Used to save to do list to localStorage
		const data = JSON.stringify(todo) 
		localStorage.setItem("dataList", data)
	}, [todo])

	function handleSubmit(e) {
		e.preventDefault() //Prevents refresh on submission

		const newTodo = {
			id: new Date().getTime(),
			text: current,
			completed: false,
		}

		setTodo([...todo].concat(newTodo)) //Adds new todo to Todos Array
		setCurrent('') //Reinitialize current to make sure no mix ups
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

	function reorderItem(id){
		const updated = [...todo].map((item) => {
			if (item.id === id) {
				//todo.indexOf(item) = reorderNumber
				const index = todo.indexOf(item)
				//todo.splice(index, 1)
				console.log('hi', index)
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
	function textWithEdit(id, text) {
		return (
			<div className="list">{text}
				<button onClick={() => setEdit(id)}>Edit</button>
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

	return (
		<div className="home">
			<form onSubmit={handleSubmit}>
				<input type="text" onChange={(e) => setCurrent(e.target.value)} value={current} />
				<button type="submit">Add Item</button>
			</form>

			{todo.map((item) => <div key={item.id} >

				{edit === item.id ? (inputWithButton(item.id)) : (textWithEdit(item.id, item.text))}
				{reorder === item.id ? (inputReorder(item.id)) : (<button onClick={() => setReorder(item.id)}>Reorder</button>)}

				<button onClick={() => deleteItem(item.id)}>Delete</button>
				<input type='checkbox' onChange={() => toggleComplete(item.id)} checked={item.completed} />

			</div>)}
		</div>
	)
}

export default Home
