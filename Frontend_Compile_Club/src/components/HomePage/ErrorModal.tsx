import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';



type ServerModalProps = {
  isShown: boolean;
  toggleIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage : string;
};

export default function ErrorModal({ isShown, toggleIsShown, errorMessage }: ServerModalProps) {

  const navigate = useNavigate()

  if (!isShown) return null;

  const handleBtnClose = () => {
    toggleIsShown(false);
    navigate('/server'); 
  };

  return (
      <motion.div
        className="error-modal-container"
        initial={{ y: '-100vh', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
      >

        <p className="problem-txt">Problem With Submit</p>
        <p style={{fontSize: '0.4em'}}> {errorMessage} </p>
        <motion.button
          onClick={handleBtnClose}
          className="close-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Return to Server 
        </motion.button>
      </motion.div>
  );
}
