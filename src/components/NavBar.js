import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as FaIcons from 'react-icons/fa';
import { SideBarData } from './SideBarData'
import './NavBar.css'


function NavBar() {
	const [sidebar, setSidebar] = useState(false);

	const showSidebar = () => setSidebar(!sidebar);

	return (
		<>
			<div className='navBar'>
				<Link to='#' className='menu-bars'>
					<FaIcons.FaBars onClick={showSidebar} />
				</Link>
			</div>

			<nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
				<ul className='nav-menu-items' onClick={showSidebar}>
					<li className='nav-bar-toggle'>
						<Link to="#" className='menu-bars'>
							<FaIcons.FaWindowClose />
						</Link>
					</li>
					{SideBarData.map((item, index) => {
						return (
							<li key={index} className={item.cName}>
								<Link to={item.path}>
									{item.icon}
									<span>{item.title}</span>
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>
		</>
	)
}

export default NavBar
