import React from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ApplicationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Received!</h1>
        <p className="text-gray-600 mb-8">
          We have successfully received your initial submission.
        </p>

        <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
          <div className="flex items-start gap-4 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Action Required</h3>
              <p className="text-sm text-blue-800 mt-1">
                We have sent an email to <strong>you and all co-founders</strong>.
              </p>
            </div>
          </div>
          <p className="text-sm text-blue-700 mt-4 pl-12 leading-relaxed">
            Please check your inbox for a link to the <strong>Innovation Index Assessment</strong>. 
            <br/><br/>
            <span className="font-semibold">Note:</span> Your application is not complete until ALL team members submit this assessment.
          </p>
        </div>

        {/* MOCK DEBUG BUTTON - To simulate clicking the email link */}
        <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
           <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">For Testing Only</p>
           <button
             onClick={() => navigate('/assessment/mock-founder-id-123')}
             className="text-indigo-600 text-sm font-medium hover:underline"
           >
             (Simulate clicking email link)
           </button>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="w-full py-3 px-6 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          Return to Home <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}