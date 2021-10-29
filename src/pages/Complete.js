import React from 'react'

function Complete() {

	const [todo, setTodo] = React.useState([])
	const [categories, setCategories] = React.useState([])
	const [complete, setComplete] = React.useState([])

	React.useEffect(() => { //Used to load to do list from localStorage
		const temp = localStorage.getItem("dataList")
		const parsed = JSON.parse(temp)

		if (parsed) {
			setTodo(parsed)
		}
	}, [])

	React.useEffect(() => { //Used to load categories list from localStorage
		const temp = localStorage.getItem("categoryList")
		const parsed = JSON.parse(temp)

		if (parsed) {
			setCategories(parsed)
		}
	}, [])

	React.useEffect(() => { //Used to load complete list from localStorage
		const temp = localStorage.getItem("completeList")
		const parsed = JSON.parse(temp)

		if (parsed) {
			setComplete(parsed)
		}
	}, [])

	React.useEffect(() => { //Used to save to do list to localStorage
		const data = JSON.stringify(todo)
		localStorage.setItem("dataList", data)
	}, [todo])

	React.useEffect(() => { //Used to save categories list to localStorage
		const tags = JSON.stringify(categories)
		localStorage.setItem("categoryList", tags)
	}, [categories])

	React.useEffect(() => { //Used to save complete list to localStorage
		const data = JSON.stringify(complete)
		localStorage.setItem("completeList", data)
	}, [complete])

	function backwardsComplete(id) {
		var updated = [...todo]
		var updatedComp = [...complete].map((current) => {
			if (current.id === id) {
				current.completed = !current.completed
			}
			return current
		})

		updatedComp.map((item) => {
			if (item.completed === false) {
				updated.push(item) //adds item back into todo list
				updatedComp = updatedComp.filter((current) => current.id !== id) //deletes item from complete list
			}
		})

		setComplete(updatedComp)
		setTodo(updated)
	}

	//function to delete items from list
	function deleteItem(id, tag) {
		const updated = [...todo].filter((current) => current.id !== id)
		const updatedCategory = [...categories]//.filter((current) => current !== tag)//Deletes category from list if there are no items with that category

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
		setComplete(updated)
	}

	return (
		<div>
			Complete
			{complete.map((item) => (
				<div> 
				{item.text}
				<button onClick={() => deleteItem(item.id, item.tag)}>Delete</button>
				<input type='checkbox' onChange={() => backwardsComplete(item.id)} checked={item.completed} />
				</div>
			))}
		</div>
	)
}

export default Complete
