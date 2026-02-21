import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav aria-label="Navigation Bar"className="w-full border-b bg-background shadow-2xl">
      <div className="w-full sm:w-full md:w-4/5 lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto flex flex-row items-center justify-between px-4 py-3 ">

        <Link to="/" className="font-semibold font-funnel text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl text-secondary">
          C.R.A.M.
        </Link>

        <div className="flex gap-6 font-instrument text-foreground text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-3xl">
            <Link to="/" className="hover:text-secondary transition-colors">Login</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;