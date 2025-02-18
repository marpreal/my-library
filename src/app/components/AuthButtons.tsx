export default function AuthButtons({ userName, handleSignIn, handleSignOut }: { userName: string; handleSignIn: () => void; handleSignOut: () => void }) {
  return (
    <>
      {userName !== "Your" ? (
        <button onClick={handleSignOut} className="px-4 py-2 bg-red-500 text-white rounded">
          Sign Out ({userName})
        </button>
      ) : (
        <button onClick={handleSignIn} className="px-4 py-2 bg-blue-500 text-white rounded">
          Sign in with Google
        </button>
      )}
    </>
  );
}
