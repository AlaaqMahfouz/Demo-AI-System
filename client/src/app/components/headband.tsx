'use client';

interface HeadbandProps {
  onToggle: () => void;
}

export default function Headband(props: HeadbandProps) {

  return (
    <header>
      <div className="bg-blue-950 h-16 w-fullz headBand">
        <button onClick={props.onToggle} className="m-4 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"className="h-7 w-7" fill="none" viewBox="0 0 20 20" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"/>
          </svg>
        </button>
      </div>
    </header>
  );
}