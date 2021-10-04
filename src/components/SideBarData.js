import React from 'react'
import * as FaIcons from 'react-icons/fa';

export const SideBarData = [
	{
		title: 'Home',
		path: '/home',
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
		title: 'Dev',
		path: '/dev',
		icon: <FaIcons.FaAnchor />,
		cName: 'nav-text'
	},
]