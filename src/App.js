import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as GeminiService from './services/gemini';

import Timeline from './components/Timeline';
import EmpathizeStep from './components/EmpathizeStep';
import DefineStep from './components/DefineStep';
import IdeateStep from './components/IdeateStep';
import PrototypeStep from './components/PrototypeStep';
import TestStep from './components/TestStep';
import DataLossWarningModal from './components/DataLossWarningModal';

const DesignThinkingApp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [empathyData, setEmpathyData] = useState({
    targetAudience: '',
    chatHistory: [],
    currentMessage: ''
  });
  const [defineData, setDefineData] = useState({
    whyAnswers: ['', '', '', '', ''],
    problemStatement: '',
    aiEvaluation: null,
    isEvaluating: false,
  });
  const [ideateData, setIdeateData] = useState({
    solutions: ['', '', ''],
    selectedSolution: ''
  });
  const [testData, setTestData] = useState({
    testPlan: '',
    chatHistory: [],
    currentMessage: '',
    feedback: ''
  });
  const [showDataWarning, setShowDataWarning] = useState(false);
  const [pendingStep, setPendingStep] = useState(null);

  const steps = [
    { name: 'Empathize', description: 'Understand your users' },
    { name: 'Define', description: 'Find the root cause' },
    { name: 'Ideate', description: 'Generate solutions' },
    { name: 'Prototype', description: 'Build your solution' },
    { name: 'Test', description: 'Validate with users' }
  ];

  const checkForDataLoss = (newStep) => {
    const hasData = empathyData.chatHistory.length > 0 ||
                   defineData.whyAnswers.some(answer => answer.trim()) ||
                   ideateData.solutions.some(solution => solution.trim()) ||
                   testData.chatHistory.length > 0;
    
    if (hasData && newStep < currentStep) {
      setPendingStep(newStep);
      setShowDataWarning(true);
      return false;
    }
    return true;
  };

  const navigateToStep = (step) => {
    if (checkForDataLoss(step)) {
      setCurrentStep(step);
    }
  };

  const confirmNavigation = () => {
    setCurrentStep(pendingStep);
    setShowDataWarning(false);
    setPendingStep(null);
  };

  const handleSendChatMessage = async (isEmpathy = true) => {
    const message = isEmpathy ? empathyData.currentMessage : testData.currentMessage;
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    
    if (isEmpathy) {
      setEmpathyData(prev => ({ ...prev, chatHistory: [...prev.chatHistory, userMessage], currentMessage: '' }));
    } else {
      setTestData(prev => ({ ...prev, chatHistory: [...prev.chatHistory, userMessage], currentMessage: '' }));
    }

    try {
      let promptText;
      if (isEmpathy) {
        promptText = `You are: ${empathyData.targetAudience}\n\nA student is interviewing you. Answer their questions naturally and briefly. Give short, direct responses - 1-2 sentences maximum. Don't use actions like *adjusts* or elaborate descriptions. Just answer the question simply.\n\nPrevious conversation:\n${empathyData.chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\nStudent asks: ${message}\n\nGive a brief, natural response as this person would. Keep it short and conversational.`;
      } else {
        promptText = `You are: ${empathyData.targetAudience}

A student is testing their solution with you. 
Problem: "${defineData.problemStatement}"
Solution: "${ideateData.selectedSolution}"
Prototype Description: "${testData.testPlan}"

Previous conversation:
${testData.chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Student: ${message}

Give brief, honest feedback about their solution, considering the prototype description. Keep your response short - 1-2 sentences maximum.`;
      }

      const chatHistory = isEmpathy ? empathyData.chatHistory : testData.chatHistory;
      const botResponseContent = await GeminiService.sendChatMessage(promptText, chatHistory);
      const botMessage = { role: 'assistant', content: botResponseContent };

      if (isEmpathy) {
        setEmpathyData(prev => ({ ...prev, chatHistory: [...prev.chatHistory, botMessage] }));
      } else {
        setTestData(prev => ({ ...prev, chatHistory: [...prev.chatHistory, botMessage] }));
      }

      setTimeout(() => {
        const chatContainer = document.querySelector('.chat-messages');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Error sending message to Gemini API:', error);
      const errorMessage = { role: 'assistant', content: `There was an error generating a response. Please check the browser console for details and try again.` };
      if (isEmpathy) {
          setEmpathyData(prev => ({ ...prev, chatHistory: [...prev.chatHistory, errorMessage] }));
      } else {
          setTestData(prev => ({ ...prev, chatHistory: [...prev.chatHistory, errorMessage] }));
      }
    }
  };

  const handleEvaluateProblemStatement = async () => {
    if (!empathyData.targetAudience || empathyData.chatHistory.length === 0 || !defineData.problemStatement.trim()) {
      alert("Please define your target audience, conduct an interview, and write a problem statement before evaluating.");
      return;
    }
    if (!defineData.whyAnswers[0].trim()) {
      alert("Please complete at least the first 'Why' in the 5-Whys analysis before evaluating.");
      return;
    }

    setDefineData(prev => ({ ...prev, isEvaluating: true, aiEvaluation: null }));

    try {
      const interviewTranscript = empathyData.chatHistory.map(msg => `${msg.role === 'user' ? 'Student' : 'Target Audience'}: ${msg.content}`).join('\n');
      const fiveWhysAnalysis = defineData.whyAnswers.filter(answer => answer.trim() !== '').map((answer, index) => `Why #${index + 1}: ${answer}`).join('\n');
      const prompt = `You are an expert Design Thinking facilitator. Your task is to evaluate the quality of a problem statement based on provided user interview data and a 5-Whys analysis.\n\nUser Interview Transcript (from Empathize phase):\n${interviewTranscript}\n\n5-Whys Analysis (from Define phase):\n${fiveWhysAnalysis}\n\nProblem Statement to Evaluate:\n${defineData.problemStatement}\n\nPlease evaluate the problem statement based on how well it:\n1.  Clearly identifies the target user (from Empathize).\n2.  States a specific need of that user (from Empathize).\n3.  Connects the need directly to an insight or root cause derived from the user interview data AND the 5-Whys analysis.\n4.  Is actionable and focused, not too broad or too narrow.\n5.  **Crucially, verify if the initial problem stated in "Why #1" of the 5-Whys analysis is directly supported and derived from the insights gathered in the "User Interview Transcript".**\n\nProvide your evaluation in a JSON format with the following structure:\n{\n  "score": [integer from 1 to 10], \n  "feedback": "[string, detailed feedback on strengths and areas for improvement, referencing the interview data and 5-Whys analysis where applicable]"\n}`;
      
      const evaluation = await GeminiService.evaluateProblemStatement(prompt);
      setDefineData(prev => ({ ...prev, aiEvaluation: evaluation }));
    } catch (error) {
      console.error('Error evaluating problem statement with AI:', error);
      alert('An error occurred during AI evaluation. Please ensure your input is complete and try again.');
    } finally {
      setDefineData(prev => ({ ...prev, isEvaluating: false }));
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return <EmpathizeStep empathyData={empathyData} setEmpathyData={setEmpathyData} sendChatMessage={handleSendChatMessage} />;
      case 1: return <DefineStep defineData={defineData} setDefineData={setDefineData} evaluateProblemStatement={handleEvaluateProblemStatement} empathyData={empathyData} />;
      case 2: return <IdeateStep ideateData={ideateData} setIdeateData={setIdeateData} defineData={defineData} />;
      case 3: return <PrototypeStep testData={testData} setTestData={setTestData} ideateData={ideateData} />;
      case 4: return <TestStep testData={testData} setTestData={setTestData} defineData={defineData} ideateData={ideateData} empathyData={empathyData} sendChatMessage={handleSendChatMessage} />;
      default: return <EmpathizeStep empathyData={empathyData} setEmpathyData={setEmpathyData} sendChatMessage={handleSendChatMessage} />;
    }
  };

  

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Timeline steps={steps} currentStep={currentStep} navigateToStep={navigateToStep} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow-sm p-4 flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-gray-800">
            {steps[currentStep].name} - {steps[currentStep].description}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateToStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Previous
            </button>
            <button
              onClick={() => navigateToStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {renderCurrentStep()}
        </div>
      </div>

      {showDataWarning && (
        <DataLossWarningModal 
          onConfirm={confirmNavigation}
          onCancel={() => setShowDataWarning(false)} 
        />
      )}
    </div>
  );
};

export default DesignThinkingApp;