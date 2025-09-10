import React from 'react';
interface LanguageSelectorProps {
  selectedLanguage?: string;
  onLanguageChange: (languageCode: string) => void;
  className?: string;
}
declare const LanguageSelector: React.FC<LanguageSelectorProps>;
export default LanguageSelector;
