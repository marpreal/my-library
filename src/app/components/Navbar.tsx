import Link from "next/link";
import { useSession } from "next-auth/react";
import { MessageSquare, Home } from "lucide-react";
import AuthDropdown from "./AuthDropdown";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({
  userName,
  handleSignIn,
  handleSignOut,
  theme,
  toggleTheme,
}: {
  userName: string;
  handleSignIn: () => void;
  handleSignOut: () => void;
  theme: string;
  toggleTheme: () => void;
}) {
  const { data: session } = useSession();

  return (
    <nav
      className={`fixed top-0 left-0 w-full shadow-md z-50 h-16 px-4 flex justify-between items-center 
      ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

      <div className="flex items-center gap-4">
        <Link href="/" className="group relative">
          <Home
            className={`w-7 h-7 transition cursor-pointer ${
              theme === "dark"
                ? "text-cyan-400 drop-shadow-[0_0_10px_#00ffff] hover:text-cyan-300 hover:drop-shadow-[0_0_15px_#00ffff] hover:bg-transparent"
                : "text-gray-800 hover:text-blue-500"
            }`}
          />
        </Link>

        {session && (
          <Link href="/chat" className="group relative">
            <MessageSquare
              className={`w-7 h-7 transition cursor-pointer ${
                theme === "dark"
                  ? "text-pink-400 drop-shadow-[0_0_10px_#ff00ff] hover:text-pink-300 hover:drop-shadow-[0_0_15px_#ff00ff] hover:bg-transparent"
                  : "text-gray-800 hover:text-blue-500"
              }`}
            />
          </Link>
        )}

        <AuthDropdown
          userName={userName}
          profileImage={session?.user?.image ?? undefined}
          handleSignIn={handleSignIn}
          handleSignOut={handleSignOut}
          theme={theme}
        />
      </div>
    </nav>
  );
}
