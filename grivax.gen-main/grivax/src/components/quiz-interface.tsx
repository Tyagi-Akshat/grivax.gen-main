"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuizInterfaceProps {
  quizId: string;
  questions?: Question[];
  title?: string;
  onComplete?: (score: number) => void;
}

export default function QuizInterface({
  quizId,
  questions = [],
  title = "Quiz",
  onComplete,
}: QuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">No questions available for this quiz.</p>
      </div>
    );
  }

  if (showResults) {
    const finalScore = (score / questions.length) * 100;
    return (
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">{title} - Results</h2>
        <div className="text-center">
          <p className="text-4xl font-bold mb-2">{finalScore.toFixed(1)}%</p>
          <p className="text-lg text-gray-600 mb-6">
            You got {score} out of {questions.length} questions correct
          </p>
          <Button
            onClick={() => {
              setCurrentQuestion(0);
              setScore(0);
              setShowResults(false);
              setSelectedAnswers([]);
              onComplete?.(score);
            }}
          >
            Retake Quiz
          </Button>
        </div>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const answered = selectedAnswers[currentQuestion] !== undefined;

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);

    // Check if answer is correct
    if (optionIndex === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600">
          Question {currentQuestion + 1} of {questions.length}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-6">{question.text}</h3>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                selectedAnswers[currentQuestion] === index
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!answered}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLastQuestion ? "Finish" : "Next"}
        </Button>
      </div>
    </Card>
  );
}
