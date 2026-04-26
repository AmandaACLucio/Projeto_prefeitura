type Props = {
    title: string;
    value: number;
  };
  
  export default function Card({ title, value }: Props) {
    return (
      <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    );
  }