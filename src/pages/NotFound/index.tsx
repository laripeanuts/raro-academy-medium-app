import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <div className="flex items-center justify-center w-screen h-screen flex-col bg-indigo-600">
    <div className="">
      <img src="http://i.stack.imgur.com/SBv4T.gif" alt="404" width="400" />
    </div>
    <p className="text-5xl text-white md:text-7xl lg:text-9xl">404</p>
    <Link to={`/`}>
      <p className="bg-white hover:bg-[#FFA4C4] font-bold mt-3 rounded-xl px-20 py-3 text-indigo-600 hover:text-gray-900">
        HOME
      </p>
    </Link>
  </div>
);
