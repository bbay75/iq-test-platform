type Props = {
  question: string;
  options: string[];
  onAnswer: (option: string) => void;
};

export default function QuestionCard({ question, options, onAnswer }: Props) {
  return (
    <div className="bg-white p-8 rounded-xl shadow w-[400px]">
      <h2 className="text-xl font-bold mb-6">{question}</h2>

      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
