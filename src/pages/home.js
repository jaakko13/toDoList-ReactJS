import React from 'react'
import './home.css';
import axios from 'axios';


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
	const [complete, setComplete] = React.useState([])
	const [search, setSearch] = React.useState('')
	const [order, setOrder] = React.useState(false)

	React.useEffect(() => {
		axios.get('http://127.0.0.1:3010/tasks')
			.then((resp) => {
				setTodo(resp.data.concat(todo))
			},
				(error) => {
					console.log(error)
				}
			)
	}, [])

	React.useEffect(() => { //Used to load categories list from localStorage
		const temp = localStorage.getItem("categoryList")
		const parsed = JSON.parse(temp)

		if (parsed) {
			setCategories(parsed)
		}
	}, [])

	React.useEffect(() => { //Used to save categories list to localStorage
		const tags = JSON.stringify(categories)
		localStorage.setItem("categoryList", tags)
	}, [categories])

	function handleSubmit(e) {

		const newTodo = { //template for each task created
			id: new Date().getTime(),
			text: current,
			completed: false,
			tag: tag,
			lastMod: new Date().getTime(),
			displayDate: new Date().toLocaleString()
		}

		fetch('http://127.0.0.1:3010/tasks', { //Used to POST new tasks to db
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: newTodo.id, text: newTodo.text, completed: newTodo.completed, tag: newTodo.tag, lastMod: newTodo.lastMod, displayDate: newTodo.displayDate })
		}).then((resp) => resp.json())
			.then((data) => { console.log(data) });


		if (!categories.includes(newTodo.tag)) { //Adds new categories to categories array and make sure no duplicates
			setCategories([...categories].concat(tag))
		}
		setCurrent('') //Reinitialize current to make sure no mix ups
		setTag('')
	}

	//function to delete items from list
	function deleteItem(id, tag) {
		const updated = [...todo].filter((current) => current.id !== id) //used for category purposes
		const updatedCategory = [...categories]

		if (updated.length < 1) {
			const first = updatedCategory.filter((current) => current !== tag) //makes sure deletion of categories when less than 1 item. Had this bug for a while...
			setCategories(first)
		}
		else {
			updated.map((item) => { //deletes tag when there are no more items with said tag
				if (tag !== item.tag) {
					console.log('item.tag')
					const final = updatedCategory.filter((current) => current !== tag)
					setCategories(final)
				}
				return item
			})
		}
		fetch(`http://127.0.0.1:3010/tasks/${id}`, { //deletes item from db 
			method: 'DELETE'
		})
		window.location.reload()

	}

	//function to toggle the complete status of items
	function toggleComplete(id) {
		var updatedComp = [...complete]
		var updated = [...todo].map((current) => {
			if (current.id === id) {
				current.completed = !current.completed //completes checkmark

				if (current.completed === true) { //adds completed item to complete list
					fetch('http://127.0.0.1:3010/completed', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ id: current.id, text: current.text, completed: current.completed, tag: current.tag, lastMod: current.lastMod, displayDate: current.displayDate })
					}).then((resp) => resp.json())
						.then((data) => { console.log(data) });

					window.location.reload()
				}
			}
			return current
		})

		updated.map((item) => {
			if (item.completed === true) {
				fetch(`http://127.0.0.1:3010/tasks/${id}`, { //deletes completed item from todo list

					method: 'DELETE'
				})
				window.location.reload()
			}
		})
	}

	//function to edit items in the list
	function editItem(id) {
		[...todo].map((item) => {
			if (item.id === id) {
				fetch(`http://127.0.0.1:3010/tasks/${id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: item.id, text: editText, completed: item.completed, tag: item.tag, lastMod: new Date().getTime(), displayDate: new Date().toLocaleString() })
				}).then((resp) => resp.json())
					.then((data) => { console.log(data) });
				window.location.reload()

			}
			return item
		})
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
	function textWithEdit(id, text, tag, displayDate) {
		return (
			<div className="list">
				<div className="list">
					{text}
					<button onClick={() => setEdit(id)}>Edit</button>
					{'Tag: ' + tag}

				</div>
				{'Last Modified: ' + displayDate}
			</div>
		);
	}

	//displays reordering field and button to reorder items
	function inputReorder(id) {
		return (
			<div>
				<input type='number' onChange={(e) => setReorderNumber(e.target.value)} value={reorderNumber} />
				<button onClick={() => reorderItem(id)}>Enter Index</button>
			</div>
		);
	}

	//change from dropdown to change categories
	function handleSelectChange(e, value) {
		setDisplayTag(e.target.value)
	}

	//dropdown menu for all categories
	function dropdown(e) {
		return (
			<div>
				<select onChange={handleSelectChange} value={displayTag}>
					<option value="Select a Category"> -- Select a category -- </option>
					<option value="all">All</option>

					{categories.map((item) => <option value={item}>{item}</option>)}
				</select>
			</div>
		)
	}


	//displays list of todo items. All conditional rendering functions inside. Makes sure correct items are shown if using search or categories or nothing.
	function display() {
		var list = todo

		if (order === true) {
			list = list.sort((a, b) => b.lastMod - a.lastMod);
		}

		if (search === '') {
			return (
				<div>
					{list.filter(item => displayTag === 'all').map(filteredItem => (
						<div key={filteredItem.id}  >
							{edit === filteredItem.id ? (inputWithButton(filteredItem.id)) : (textWithEdit(filteredItem.id, filteredItem.text, filteredItem.tag, filteredItem.displayDate))}
							{reorder === filteredItem.id ? (inputReorder(filteredItem.id)) : (<button onClick={() => setReorder(filteredItem.id)}>Reorder</button>)}

							<button onClick={() => deleteItem(filteredItem.id, filteredItem.tag)}>Delete</button>
							<input type='checkbox' onChange={() => toggleComplete(filteredItem.id)} checked={filteredItem.completed} />

						</div>
					))}

					{list.filter(item => item.tag === displayTag).map(filteredItem => (
						<div key={filteredItem.id} >
							{edit === filteredItem.id ? (inputWithButton(filteredItem.id)) : (textWithEdit(filteredItem.id, filteredItem.text, filteredItem.tag, filteredItem.displayDate))}
							{reorder === filteredItem.id ? (inputReorder(filteredItem.id)) : (<button onClick={() => setReorder(filteredItem.id)}>Reorder</button>)}

							<button onClick={() => deleteItem(filteredItem.id, filteredItem.tag)}>Delete</button>
							<input type='checkbox' onChange={() => toggleComplete(filteredItem.id)} checked={filteredItem.completed} />

						</div>
					))}
				</div>
			)
		}
		else {
			return (
				<div>
					{filteredItems.map(item => {
						return (
							<div>
								{edit === item.id ? (inputWithButton(item.id)) : (textWithEdit(item.id, item.text, item.tag, item.displayDate))}
								{reorder === item.id ? (inputReorder(item.id)) : (<button onClick={() => setReorder(item.id)}>Reorder</button>)}

								<button onClick={() => deleteItem(item.id, item.tag)}>Delete</button>
								<input type='checkbox' onChange={() => toggleComplete(item.id)} checked={item.completed} />
							</div>
						)
					})}
				</div>
			)
		}
	}

	//changes search value
	const handleChange = e => {
		setSearch(e.target.value)
	}

	//list of items that are searched
	const filteredItems = todo.filter(item =>
		item.text.toLowerCase().includes(search.toLowerCase())
	)

	return (
		<div className="home">
			<div className="input">
				<div className='search'>
					<h3>Search To-do Item</h3>
					<form>
						<input type='text' placeholder='Search' className='search-input' onChange={handleChange} />
					</form>
				</div>

				{dropdown()}
				<form onSubmit={handleSubmit}>
					<input type="text" onChange={(e) => setCurrent(e.target.value)} value={current} placeholder='Text' />
					<input type="text" onChange={(e) => setTag(e.target.value)} value={tag} placeholder='Category' />

					<button type="submit">Add Item</button>
					<button type="button" onClick={() => setOrder(!order)}> Order by Last Modification</button>
				</form>

				{display()}

			</div>

		</div >
	)
}


export default Home
