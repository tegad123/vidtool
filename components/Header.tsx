import ThemeSwitch from "./ThemeSwitch";

export default function Header() {
  return (
    <header className="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <span className="text-lg font-bold text-gray-900 dark:text-white">VidTool</span>
        <ThemeSwitch />
      </div>
    </header>
  );
}

