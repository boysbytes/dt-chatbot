import React from 'react';
import { MessageCircle, Copy } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

const EmpathizeStep = ({ empathyData, setEmpathyData, sendChatMessage }) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Empathize Phase</h3>
        <p className="text-blue-700">
          Start by defining your target audience, then use the chatbot to interview them and understand their needs, pain points, and experiences.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
            Define Your Target Audience
          </label>
          <textarea
            id="targetAudience"
            value={empathyData.targetAudience}
            onChange={(e) => setEmpathyData(prev => ({ ...prev, targetAudience: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="e.g., College students who struggle with time management, Working parents with young children, etc."
          />
        </div>

        {empathyData.targetAudience && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <MessageCircle className="w-5 h-5 text-blue-500 mr-2" />
              <h4 className="font-semibold">Interview Your Target Audience</h4>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4 p-2 border border-gray-200 rounded-lg chat-messages">
              {empathyData.chatHistory.map((msg, index) => (
                <div key={index} className={`p-3 rounded-lg ${
                  msg.role === 'user' ? 'bg-blue-100 ml-8 self-end text-right' : 'bg-gray-100 mr-8 self-start text-left'
                }`}>
                  <div className="font-semibold text-sm mb-1">
                    {msg.role === 'user' ? 'You' : 'Target Audience'}
                  </div>
                  <div>{msg.content}</div>
                  <button
                    onClick={() => copyToClipboard(msg.content)}
                    className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center justify-end"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={empathyData.currentMessage}
                onChange={(e) => setEmpathyData(prev => ({ ...prev, currentMessage: e.target.value }))}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ask about their experiences, challenges, needs..."
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage(true)}
              />
              <button
                onClick={() => sendChatMessage(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpathizeStep;
