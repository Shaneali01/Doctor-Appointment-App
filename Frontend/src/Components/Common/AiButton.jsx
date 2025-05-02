// AiButton.jsx
import { useNavigate } from 'react-router-dom';

function AiButton() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/chatbot'); // Navigate to the chatbot page
    };

    return (
        <button 
            onClick={handleClick} 
            className="fixed bottom-4 cursor-pointer z-10 bg-teal-600 font-bold  right-4 text-white  p-4 rounded-full shadow-lg hover:bg-teal-500 transition">
            💬 AI Chat
        </button>
    );
}

export default AiButton;
