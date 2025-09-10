interface ReviewFormProps {
  setFormStep: (step: number) => void;
  handleSave: () => void;
  handleBack: () => void;
  saving: boolean;
}
declare const ReviewForm: ({
  setFormStep,
  handleBack,
  handleSave,
  saving,
}: ReviewFormProps) => import('react/jsx-runtime').JSX.Element;
export default ReviewForm;
