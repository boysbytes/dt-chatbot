import React from 'react';
import { MessageCircle, Copy } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

const TestStep = ({ testData, setTestData, defineData, ideateData, empathyData, sendChatMessage }) => {
  return (
    <div className="space-y-6">
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="font-semibold text-red-800 mb-2">Test Phase</h3>
        <p className="text-red-700">
          Test your solution with your target audience using the chatbot. Get feedback and iterate on your design.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Testing Your Solution</h4>
          <div className="p-3 bg-gray-50 rounded-lg text-gray-700 text-sm">
            <strong>Problem:</strong> {defineData.problemStatement || 'Not defined. Please complete the Define phase.'}<br />
            <strong>Solution:</strong> {ideateData.selectedSolution || 'Not selected. Please complete the Ideate phase.'}<br />
            <strong>Prototype Description:</strong> {testData.testPlan || 'Not provided. Please complete the Prototype phase.'}<br />
            <strong>Target Audience:</strong> {empathyData.targetAudience || 'Not defined. Please complete the Empathize phase.'}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <MessageCircle className="w-5 h-5 text-red-500 mr-2" />
            <h4 className="font-semibold">Test with Your Target Audience</h4>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto mb-4 p-2 border border-gray-200 rounded-lg chat-messages">
            {testData.chatHistory.map((msg, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                msg.role === 'user' ? 'bg-red-100 ml-8 self-end text-right' : 'bg-gray-100 mr-8 self-start text-left'
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
              value={testData.currentMessage}
              onChange={(e) => setTestData(prev => ({ ...prev, currentMessage: e.target.value }))}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Present your solution, ask for feedback..."
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage(false)}
            />
            <button
              onClick={() => sendChatMessage(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Send
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
            Key Insights & Next Steps
          </label>
          <textarea
            id="feedback"
            value={testData.feedback}
            onChange={(e) => setTestData(prev => ({ ...prev, feedback: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows="4"
            placeholder="What did you learn from testing? What would you change or improve?"
          />
        </div>
      </div>
    </div>
  );
};

export default TestStep;
