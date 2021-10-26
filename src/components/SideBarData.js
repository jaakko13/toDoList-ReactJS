import React from 'react'
import * as FaIcons from 'react-icons/fa';

export const SideBarData = [
	{
		title: 'Home',
		path: '/',
		icon: <FaIcons.FaHome />,
		cName: 'nav-text'
	},
	{
		title: 'Info',
		path: '/info',
		icon: <FaIcons.FaInfoCircle />,
		cName: 'nav-text'
	},
	{
		title: 'Complete',
		path: '/complete',
		icon: <FaIcons.FaCheck />,
		cName: 'nav-text'
	},
]