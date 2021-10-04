import React from 'react'
import './home.css';


function Home() {
	const [todo, setTodo] = React.useState([])
	const [current, setCurrent] = React.useState('')

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

	function deleteItem(id){
		const updated = [...todo].filter((current) => current.id !== id)
		setTodo(updated)
	}

	return (
		<div className="home">
			<form onSubmit={handleSubmit}>
				<input type="text" onChange={(e) => setCurrent(e.target.value)} value={current} />
				<button type="submit">Add Item</button>
			</form>

			{todo.map((item) => <div className="list" key={item.id} >
				<div>{item.text}</div>
				<button onClick={() => deleteItem(item.id)}>Delete</button>
			</div>)}
		</div> 
	)
}

export default Home
