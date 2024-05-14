'use client'

import Link from 'next/link';
import React from 'react';
import SearchRecordList from './searchRecordList';

const Sidebar = (props: { isSidebarOpen: boolean }) => {
  return (
    <div className={`
        ${ props.isSidebarOpen ? "block" : "hidden" }
        sidebar sm:block w-64 bg-blue-950 flex-col text-white shadow-lg absolute overflow-y-auto float-start`}
    >
        <div className='m-4 justify-center'>
            <nav className='text-base font-bold flex justify-center items-center m-4'>
                <Link href="/logout" className="flex w-36 h-12 text-center justify-center py-2 px-3 rounded-full bg-white hover:bg-blue-950 text-lg text-blue-950 hover:text-white border-blue-950 hover:border-white  border-2 font-extrabold">
                <svg className="w-5 mr-3 h-5 m-1" aria-hidden="true" fill="currentColor" viewBox="0 0 1024 1024">
                  <path stroke="currentColor" strokeWidth="5" strokeMiterlimit="10" strokeLinecap="round" d="M116.832 543.664H671.28c17.696 0 32-14.336 32-32s-14.304-32-32-32H118.832l115.76-115.76c12.496-12.496 12.496-32.752 0-45.248s-32.752-12.496-45.248 0l-189.008 194 189.008 194c6.256 6.256 14.432 9.376 22.624 9.376s16.368-3.12 22.624-9.376c12.496-12.496 12.496-32.752 0-45.248zM959.664 0H415.663c-35.36 0-64 28.656-64 64v288h64.416V103.024c0-21.376 17.344-38.72 38.72-38.72h464.72c21.391 0 38.72 17.344 38.72 38.72l1.007 818.288c0 21.376-17.328 38.72-38.72 38.72H454.816c-21.376 0-38.72-17.344-38.72-38.72V670.944l-64.416.08V960c0 35.344 28.64 64 64 64h543.984c35.36 0 64.016-28.656 64.016-64V64c-.015-35.344-28.671-64-64.015-64z"/>
                </svg>
                  Log Out
                </Link>
            </nav>
            <hr className="w-44 items-center mx-4 mb-7 mt-9 border-gray-100 border-2" />
            <SearchRecordList/>
        </div>
    </div>
  );
};

export default Sidebar;