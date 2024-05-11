// import Link from 'next/link'
// import React from 'react'

// interface UrlComponentProps{
//     searchID: number,
//     title: string
// }

// const UrlComponent:React.FC<UrlComponentProps> = ({searchID, title}) => {
//   return (
//     <Link href={{
//         pathname: '/searchRecord',
//         query:{
//           searchID: searchID,
//           title: title
//         }
//       }}  passHref>
//         <span className="cursor-pointer flex items-center justify-center m-2 mb-10 rounded-3xl h-28  bg-gray-100 hover:bg-blue-950 text-blue-900 hover:text-gray-100 hover:shadow-xl hover:shadow-blue-900 hover:-translate-y-3 font-bold text-center text-lg border-blue-950 hover:border-gray-100  border-2">
//           {title}
//         </span>
//       </Link>
//   )
// }

// export default UrlComponent