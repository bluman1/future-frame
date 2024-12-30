interface AnswersSectionProps {
  answers: Record<string, string>;
}

export const AnswersSection = ({ answers }: AnswersSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(answers).map(([question, answer]) => (
        <div
          key={question}
          className="p-6 rounded-xl bg-secondary/50 backdrop-blur-sm"
        >
          <h3 className="font-medium text-sm text-muted-foreground mb-2">
            {question}
          </h3>
          <p className="text-lg">{answer}</p>
        </div>
      ))}
    </div>
  );
};