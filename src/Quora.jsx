const handleSubmit = () => {
  setError('');
    
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    setError('Please enter a valid email address');
    return;
  }

  if (mode === 'login') {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    const success = onLogin(formData.email, formData.password);
    if (!success) {
      setError('Invalid email or password');
    }
  } else {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    const success = onRegister(formData.name, formData.email, formData.password);
    if (!success) {
      setError('User with this email already exists');
    }
  }
};import React, { useState, useEffect } from 'react';
import { Search, User, MessageCircle, ThumbsUp, ThumbsDown, Plus, LogOut, Home, Edit3 } from 'lucide-react';

const QuoraClone = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  
  // Sample data - in a real app, this would come from a backend
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password123', avatar: 'JS' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', password: 'password123', avatar: 'MJ' }
  ]);
  
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: 'What are the best practices for React development?',
      content: 'I\'m learning React and want to know the industry best practices for writing clean, maintainable code.',
      author: 'John Doe',
      authorId: 1,
      timestamp: '2 hours ago',
      tags: ['React', 'JavaScript', 'Web Development'],
      answers: [
        {
          id: 1,
          content: 'Some key best practices include: 1) Use functional components with hooks, 2) Keep components small and focused, 3) Use proper state management, 4) Write tests for your components, 5) Follow naming conventions consistently.',
          author: 'Jane Smith',
          authorId: 2,
          timestamp: '1 hour ago',
          upvotes: 15,
          downvotes: 2,
          userVote: null
        },
        {
          id: 2,
          content: 'Don\'t forget about performance optimization! Use React.memo for expensive components, implement proper key props in lists, and consider code splitting for larger applications.',
          author: 'Mike Johnson',
          authorId: 3,
          timestamp: '30 minutes ago',
          upvotes: 8,
          downvotes: 0,
          userVote: null
        }
      ]
    },
    {
      id: 2,
      title: 'How do I start a successful startup?',
      content: 'I have an idea for a tech startup but don\'t know where to begin. What are the first steps?',
      author: 'Jane Smith',
      authorId: 2,
      timestamp: '5 hours ago',
      tags: ['Startup', 'Business', 'Entrepreneurship'],
      answers: [
        {
          id: 3,
          content: 'Start by validating your idea with potential customers. Build a minimum viable product (MVP) and get feedback early. Don\'t spend too much time perfecting the product before testing it in the market.',
          author: 'John Doe',
          authorId: 1,
          timestamp: '3 hours ago',
          upvotes: 12,
          downvotes: 1,
          userVote: null
        }
      ]
    },
    {
      id: 3,
      title: 'What programming language should I learn first?',
      content: 'I\'m completely new to programming and want to know which language would be best to start with.',
      author: 'Mike Johnson',
      authorId: 3,
      timestamp: '1 day ago',
      tags: ['Programming', 'Beginners', 'Learning'],
      answers: [
        {
          id: 4,
          content: 'Python is excellent for beginners due to its simple syntax and versatility. You can use it for web development, data science, automation, and more. JavaScript is also great if you want to focus on web development.',
          author: 'Jane Smith',
          authorId: 2,
          timestamp: '20 hours ago',
          upvotes: 25,
          downvotes: 3,
          userVote: null
        }
      ]
    }
  ]);

  // Authentication functions
  const handleLogin = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setShowAuthModal(false);
      return true;
    }
    return false;
  };

  const handleRegister = (name, email, password) => {
    if (users.find(u => u.email === email)) {
      return false; // User already exists
    }
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password,
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase()
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setShowAuthModal(false);
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  // Question and Answer functions
  const handlePostQuestion = (title, content, tags) => {
    if (!currentUser) return;
    
    const newQuestion = {
      id: questions.length + 1,
      title,
      content,
      author: currentUser.name,
      authorId: currentUser.id,
      timestamp: 'Just now',
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      answers: []
    };
    setQuestions([newQuestion, ...questions]);
    setShowQuestionModal(false);
  };

  const handlePostAnswer = (questionId, content) => {
    if (!currentUser) return;
    
    const newAnswer = {
      id: Date.now(),
      content,
      author: currentUser.name,
      authorId: currentUser.id,
      timestamp: 'Just now',
      upvotes: 0,
      downvotes: 0,
      userVote: null
    };
    
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, answers: [...q.answers, newAnswer] }
        : q
    ));
  };

  const handleVote = (questionId, answerId, voteType) => {
    if (!currentUser) return;
    
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? {
            ...q,
            answers: q.answers.map(a => {
              if (a.id === answerId) {
                let newUpvotes = a.upvotes;
                let newDownvotes = a.downvotes;
                let newUserVote = voteType;
                
                // Remove previous vote if exists
                if (a.userVote === 'up') newUpvotes--;
                if (a.userVote === 'down') newDownvotes--;
                
                // Add new vote if different from previous
                if (a.userVote !== voteType) {
                  if (voteType === 'up') newUpvotes++;
                  if (voteType === 'down') newDownvotes++;
                } else {
                  newUserVote = null; // Toggle off if same vote
                }
                
                return {
                  ...a,
                  upvotes: newUpvotes,
                  downvotes: newDownvotes,
                  userVote: newUserVote
                };
              }
              return a;
            })
          }
        : q
    ));
  };

  // Filter questions based on search
  const filteredQuestions = questions.filter(q => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-red-600">Quora</h1>
              <nav className="hidden md:flex space-x-4">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex items-center px-3 py-2 rounded-md ${
                    activeTab === 'home' ? 'bg-gray-100 text-red-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </button>
              </nav>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search questions, topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {currentUser ? (
                <>
                  <button
                    onClick={() => setShowQuestionModal(true)}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Question
                  </button>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {currentUser.avatar}
                    </div>
                    <span className="hidden md:block font-medium">{currentUser.name}</span>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Question Feed */}
        <div className="space-y-6">
          {filteredQuestions.map(question => (
            <QuestionCard
              key={question.id}
              question={question}
              currentUser={currentUser}
              onPostAnswer={handlePostAnswer}
              onVote={handleVote}
            />
          ))}
          
          {filteredQuestions.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <p className="text-gray-500">No questions found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {/* Question Modal */}
      {showQuestionModal && (
        <QuestionModal
          onClose={() => setShowQuestionModal(false)}
          onPost={handlePostQuestion}
        />
      )}
    </div>
  );
};

// Question Card Component
const QuestionCard = ({ question, currentUser, onPostAnswer, onVote }) => {
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerContent, setAnswerContent] = useState('');

  const handleSubmitAnswer = () => {
    if (answerContent.trim()) {
      onPostAnswer(question.id, answerContent);
      setAnswerContent('');
      setShowAnswerForm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{question.author}</p>
            <p className="text-sm text-gray-500">{question.timestamp}</p>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{question.title}</h2>
      <p className="text-gray-700 mb-4">{question.content}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {question.tags.map(tag => (
          <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4 mb-6 pb-4 border-b">
        <button
          onClick={() => currentUser && setShowAnswerForm(!showAnswerForm)}
          className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
          disabled={!currentUser}
        >
          <Edit3 className="w-4 h-4 mr-1" />
          Answer
        </button>
        <div className="flex items-center text-gray-500">
          <MessageCircle className="w-4 h-4 mr-1" />
          {question.answers.length} answers
        </div>
      </div>

      {/* Answer Form */}
      {showAnswerForm && currentUser && (
        <div className="mb-6">
          <textarea
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder="Write your answer..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows="4"
          />
          <div className="mt-3 flex space-x-2">
            <button
              onClick={handleSubmitAnswer}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Post Answer
            </button>
            <button
              onClick={() => setShowAnswerForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Answers */}
      <div className="space-y-4">
        {question.answers.map(answer => (
          <AnswerCard
            key={answer.id}
            answer={answer}
            questionId={question.id}
            currentUser={currentUser}
            onVote={onVote}
          />
        ))}
      </div>
    </div>
  );
};

// Answer Card Component
const AnswerCard = ({ answer, questionId, currentUser, onVote }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{answer.author}</p>
            <p className="text-xs text-gray-500">{answer.timestamp}</p>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{answer.content}</p>

      {/* Voting */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => currentUser && onVote(questionId, answer.id, 'up')}
            className={`p-1 rounded transition-colors ${
              answer.userVote === 'up' 
                ? 'text-green-600 bg-green-100' 
                : 'text-gray-600 hover:text-green-600 hover:bg-green-100'
            }`}
            disabled={!currentUser}
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium">{answer.upvotes}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => currentUser && onVote(questionId, answer.id, 'down')}
            className={`p-1 rounded transition-colors ${
              answer.userVote === 'down' 
                ? 'text-red-600 bg-red-100' 
                : 'text-gray-600 hover:text-red-600 hover:bg-red-100'
            }`}
            disabled={!currentUser}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium">{answer.downvotes}</span>
        </div>
      </div>
    </div>
  );
};

// Auth Modal Component
const AuthModal = ({ mode, setMode, onClose, onLogin, onRegister }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (mode === 'login') {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
      const success = onLogin(formData.email, formData.password);
      if (!success) {
        setError('Invalid email or password');
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      const success = onRegister(formData.name, formData.email, formData.password);
      if (!success) {
        setError('User with this email already exists');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {mode === 'login' ? 'Sign In' : 'Sign Up'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div>
          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mb-4"
          >
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-red-600 hover:text-red-700"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Question Modal Component
const QuestionModal = ({ onClose, onPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      return;
    }
    onPost(title, content, tags);
    setTitle('');
    setContent('');
    setTags('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Add Question</h2>
        
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to ask?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Details</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide more details about your question..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows="4"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. React, JavaScript, Programming"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Post Question
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default QuoraClone;