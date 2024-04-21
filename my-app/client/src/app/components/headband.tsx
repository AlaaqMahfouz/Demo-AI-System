'use client'

export default function Headband(props: { onToggle: () => void }) {
  return (
    <header>
      {/* <div className="p-6 w-full h-6 bg-red text-white border-gray-200 dark:bg-indigo-500"> */}
        <div>
          <button onClick={props.onToggle}  className="m-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 20 20"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      {/* </div> */}
    </header>
  );
}