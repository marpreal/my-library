export function CategoryCard({
    title,
    description,
    imageUrl,
    onClick,
  }: {
    title: string;
    description: string;
    imageUrl: string;
    onClick: () => void;
  }) {
    return (
      <div
        className="w-full max-w-sm bg-gradient-to-b from-[#fff5e6] to-[#f7e7c3] rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition cursor-pointer"
        onClick={onClick}
      >
        <div
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        ></div>
        <div className="p-4 text-center">
          <h3 className="text-3xl font-bold text-[#83511e] mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    );
  }