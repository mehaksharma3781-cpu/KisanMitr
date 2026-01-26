import React from 'react';
import AIAssistant from '@/components/AIAssistant';
import { useNavigate } from 'react-router-dom';

const AIAssistantPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AIAssistant onClose={() => navigate(-1)} />
  );
};

export default AIAssistantPage;
