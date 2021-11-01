import React from 'react'

function Info() {
	return (
		<div>
			<h3>Author:</h3>
			<p>Jaakko Virtanen</p>

			<h3>Description:</h3>
			<p>The main page consists of Search component at the top. User is able to type in here and look for todo items, only relevant items will appear.
				<br></br>
				Below that there is the dropdown menu that allows you to display either all items or items of a certain category only. Then you have two
				<br></br>
				input fields, the first one you enter the text you want the item to have and the second one is the category you want the item to have.
				<br></br>
				To the right of that you have the add button which submits the item. And to the right of that there is a button that will order the 
				<br></br>
				items by last modification date. The todo items appear below all of this. In the items themselves from left to right you have the text
				<br></br>
				The edit button which allows you to change the text, and the tag. Below this it shows the last modification date. And finally below this
				<br></br>
				you have the reorder button which allows you to change the index of the item and reorder all items as you choose, then there is the delete
				<br></br>
				button which deletes the item, and the checkbox which completes the item and moves it to the complete list which can be found from the menu
				<br></br>
				at the top left of the page. 
			</p>

			<h3>Licenses/Permissions:</h3>
			<p>I got them all. Icons are Font Awesome Library. Everything else is me.</p>
		</div>
	)
}

export default Info
