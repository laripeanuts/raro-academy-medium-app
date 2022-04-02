import { Navigation } from "../Navigation";

export const Header = () => (
  <header className="flex items-center justify-between px-10 py-6 bg-gray-200">
    <div className="flex items-center space-x-2">
      <img
        className="h-full w-28"
        src="https://rarolabs.com.br/assets/logo-cae9beb1976500005b5e29dea19bdaa2761082232703a16beb71ffd2117014e5.png"
        alt="Workflow"
      />
    </div>
    <nav className="flex items-center space-x-8 font-bold text-[#44c2fd]">
      <Navigation />
    </nav>
  </header>
);
