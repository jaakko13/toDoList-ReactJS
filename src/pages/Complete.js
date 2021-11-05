import React from 'react'
import axios from 'axios'
import './complete.css';


function Complete() {

	const [todo, setTodo] = React.useState([])
	const [categories, setCategories] = React.useState([])
	const [complete, setComplete] = React.useState([])

	React.useEffect(() => { //Used to load categories list from localStorage
		const temp = localStorage.getItem("categoryList")
		const parsed = JSON.parse(temp)

		if (parsed) {
			setCategories(parsed)
		}
	}, [])

	React.useEffect(() => { //Used to load complete list from localStorage
		axios.get('http://127.0.0.1:3010/completed')
			.then((resp) => {
				setComplete(resp.data.concat(complete))
			},
				(error) => {
					console.log(error)
				}
			)
	}, [])

	React.useEffect(() => { //Used to save categories list to localStorage
		const tags = JSON.stringify(categories)
		localStorage.setItem("categoryList", tags)
	}, [categories])

	//function to unComplete items and send them back to main todo list
	function backwardsComplete(id) {
		var updatedComp = [...complete].map((current) => { //uncompletes checkmark
			if (current.id === id) {
				current.completed = !current.completed
			}
			return current
		})

		updatedComp.map((item) => {
			if (item.completed === false) {
				fetch('http://127.0.0.1:3010/tasks', {//adds item back into todo list
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: item.id, text: item.text, completed: item.completed, tag: item.tag, lastMod: item.lastMod, displayDate: item.displayDate, outOfTime: item.outOfTime, alarm: item.alarm })
				}).then((resp) => resp.json())
					.then((data) => { console.log(data) });


				fetch(`http://127.0.0.1:3010/completed/${id}`, {//deletes item from complete list
					method: 'DELETE'
				})
				window.location.reload()
			}
		})


	}

	//function to delete items from list
	function deleteItem(id, tag) {
		const updated = [...todo].filter((current) => current.id !== id) //used for category purposes
		const updatedCategory = [...categories]

		if (updated.length < 1) {
			const first = updatedCategory.filter((current) => current !== tag) //makes sure deletion of categories when less than 1 item.
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

		fetch(`http://127.0.0.1:3010/completed/${id}`, { //deletes item
			method: 'DELETE'
		})

		window.location.reload()
	}

	return (
		<div className='ting'>
			<h3>List of Completed Items</h3>
			{complete.map((item) => (
				<div className='complete'>
					<div>
						{item.text}
						{` Tag: ` + item.tag}
					</div>
					<div>
						<button onClick={() => deleteItem(item.id, item.tag)}>Delete</button>
						<input type='checkbox' onChange={() => backwardsComplete(item.id)} checked={item.completed} />
					</div>
				</div>
			))}
		</div>
	)
}

export default Complete
