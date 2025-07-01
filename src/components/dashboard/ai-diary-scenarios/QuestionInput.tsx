
import React, { useMemo } from 'react';
import { Question } from './types';
import ScaleInput from './question-inputs/ScaleInput';
import EmojiScaleInput from './question-inputs/EmojiScaleInput';
import MultipleChoiceInput from './question-inputs/MultipleChoiceInput';
import MultiSelectInput from './question-inputs/MultiSelectInput';
import TextInput from './question-inputs/TextInput';
import SubmitButton from './question-inputs/SubmitButton';

interface QuestionInputProps {
  question: Question;
  currentResponse: string | number | string[] | number[];
  setCurrentResponse: React.Dispatch<React.SetStateAction<string | number | string[] | number[]>>;
  onSubmitResponse: () => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  question,
  currentResponse,
  setCurrentResponse,
  onSubmitResponse
}) => {
  const isResponseValid = useMemo(() => {
    if (currentResponse === '' || currentResponse === null || currentResponse === undefined) {
      return false;
    }
    if (Array.isArray(currentResponse)) {
      return currentResponse.length > 0;
    }
    return true;
  }, [currentResponse]);

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'scale':
        return (
          <ScaleInput
            question={question}
            currentResponse={currentResponse}
            setCurrentResponse={setCurrentResponse}
          />
        );

      case 'emoji-scale':
        return (
          <EmojiScaleInput
            question={question}
            currentResponse={currentResponse}
            setCurrentResponse={setCurrentResponse}
          />
        );

      case 'multiple-choice':
        return (
          <MultipleChoiceInput
            question={question}
            currentResponse={currentResponse}
            setCurrentResponse={setCurrentResponse}
          />
        );

      case 'multi-select':
        return (
          <MultiSelectInput
            question={question}
            currentResponse={currentResponse}
            setCurrentResponse={setCurrentResponse}
          />
        );

      case 'text':
        return (
          <TextInput
            currentResponse={currentResponse}
            setCurrentResponse={setCurrentResponse}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderQuestionInput()}
      <SubmitButton
        question={question}
        isResponseValid={isResponseValid}
        onSubmitResponse={onSubmitResponse}
      />
    </>
  );
};

export default QuestionInput;
