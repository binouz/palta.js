import PaltaLogo from '/palta-logo.svg?url'

// @Palta.component
export default function Header() {
  return (
    <nav className='w-full m-1 bg-slate-400 rounded p-2 flex items-center h-14 shadow-md gap-2'>
      <img src={PaltaLogo} className='w-5' />
      <h1 className="text-3xl font-bold text-gray-800 uppercase">Palta</h1>
    </nav>
  );
}