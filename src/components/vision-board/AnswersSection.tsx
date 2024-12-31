interface AnswersSectionProps {
  answers: Record<string, string>;
}

export const AnswersSection = ({ answers }: AnswersSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(answers).map(([question, answer]) => (
        <div
          key={question}
          className="group p-6 rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 backdrop-blur-sm border border-purple-100/50 transition-all duration-300 hover:shadow-lg"
        >
          <h3 className="font-medium text-sm text-purple-600 mb-2 group-hover:text-purple-700 transition-colors">
            {question}
          </h3>
          <p className="text-lg text-gray-700">{answer}</p>
        </div>
      ))}
    </div>
  );
};