import dynamic from "next/dynamic";
import Link from "next/link";

const TypedText = dynamic(() => import("./TypedText"), { ssr: false });

interface SectionProps {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  link: string;
}

export default function Section({ id, title, description, backgroundImage, link }: SectionProps) {
  return (
    <div id={id} className="h-screen flex items-center justify-center bg-center bg-cover relative" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="text-center p-8 bg-white/90 rounded-3xl shadow-2xl backdrop-blur-md max-w-md w-full border border-gray-200">
        <h1 className="text-5xl font-bold text-highlight mb-4 drop-shadow-md">
          <TypedText key={title} text={title} delay={60} loop={false} />
        </h1>
        <div className="text-gray-700 text-lg italic mb-6 hover:text-olive transition">
          <TypedText text={description} delay={40} />
        </div>
        <Link href={link} className="px-6 py-3 bg-accent text-highlight border-2 border-highlight rounded-full shadow-lg hover:shadow-xl hover:bg-highlight hover:text-olive transition transform hover:scale-105">
          Explore {title}
        </Link>
      </div>
    </div>
  );
}
