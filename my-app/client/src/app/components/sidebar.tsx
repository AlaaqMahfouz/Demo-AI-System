'use client'

import Link from 'next/link';
import React from 'react';
import GetOldRecords from './getOldRecords';

const Sidebar = (props: { isSidebarOpen: boolean }) => {

  return (
    <div className={`
        ${ props.isSidebarOpen ? "block" : "hidden" }
        sidebar sm:block w-64 h-full dark:bg-indigo-500 text-white shadow-md absolute overflow-y-auto`}
    >
        <div style={{ marginRight: '10px' }} className='m-4'>
            <nav className='text-base font-bold flex justify-center items-center m-7'>
                <Link href={"/logout"} className=" w-fit text-center block py-2 px-3 rounded-full bg-white text-indigo-500">Log out</Link>
            </nav>
            <p className='text-center font-bold mb-7'>________________________</p>
            <GetOldRecords/>
        </div>
    </div>
  );
};

export default Sidebar;