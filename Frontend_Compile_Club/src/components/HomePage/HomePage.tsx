import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import { Forward } from 'lucide-react';

// components
import ErrorModal from './ErrorModal'

// hooks
import useHandleRequest from './hooks/useHandleRequest';

export default function HomePage() {
  const { handleRequest, isLoading, errorFound, isDuplicate, errorMessage } = useHandleRequest();

  useEffect(() => {
    if (errorMessage) {
      if (isDuplicate) {
        setModalErrorMessage(errorMessage)
      } 
      else if (errorFound) {
        setModalErrorMessage(errorMessage)
      }
      toggleIsShown(true)
    }

  }, [isDuplicate, errorFound, errorMessage]);



  const navigate = useNavigate(); // ← for routing

  const [isShown, toggleIsShown] = useState(false)
  const [modalErrorMessage, setModalErrorMessage] = useState('')

  const [hearFormChoice, setHearFormChoice] = useState('');
  const [nameField, setNameField] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const isNameValid = nameField.trim().length > 0;
  const isHearFormValid = hearFormChoice.trim().length > 0;

  const formState = isNameValid && isHearFormValid
    ? 'can-confirm'
    : isNameValid || isHearFormValid
    ? 'cant-confirm'
    : 'skip';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formState === 'can-confirm') {
      handleRequest(hearFormChoice, nameField);
    } else if (formState === 'skip') {
      navigate('/server'); // redirect if skipping
    } else {
      // trigger shake if partially filled
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <>
      <div className="home-container">
        <div className="home-header">
          <p className="title-text">Compile</p>
          <p className="club-text title-text">Club</p>
        </div>

        <div className="home-body">
          <form onSubmit={handleSubmit}>
            <DropdownButton
              id="dropdown-basic-button"
              title={"Where did you hear about Compile Club?"}
              className="my-dropdown-btn"
            >
              <Dropdown.Item as="button" type="button" onClick={() => setHearFormChoice("Flyer at a coffee shop")}>
                Flyer at a Coffee shop
              </Dropdown.Item>
              <Dropdown.Item as="button" type="button"onClick={() => setHearFormChoice("Flyer at a Library")}>
                Flyer at a Library
              </Dropdown.Item>
              <Dropdown.Item as="button" type="button"onClick={() => setHearFormChoice("Word of mouth")}>
                Word of mouth
              </Dropdown.Item>
              <Dropdown.Item as="button" type="button"onClick={() => setHearFormChoice("Through a friend")}>
                Through a friend
              </Dropdown.Item>
              <Dropdown.Item as="button" type="button"onClick={() => setHearFormChoice('')}>
                — Clear Selection —
              </Dropdown.Item>
            </DropdownButton>

            <div className="input-container">
              <p className="input-label">What's your name?</p>
              <input
                className="my-input"
                placeholder="john doe"
                value={nameField}
                onChange={(e) => setNameField(e.target.value)}
              />
            </div>

            <motion.button
              disabled={isLoading}
              type="submit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={isShaking ? { x: [-10, 10, -6, 6, -3, 3, 0] } : {}}
              transition={{
                type: 'tween',
                ease: 'easeInOut',
                duration: 0.4
              }}
              className={`submit-btn submit-btn-${formState}`}
            >
              {formState === 'skip' ? 'Skip' : 'Confirm'}
              <Forward size={18} className="arrow-symbol" />
            </motion.button>
          </form>
        </div>
      </div>
      <ErrorModal isShown={isShown} toggleIsShown={toggleIsShown} errorMessage={modalErrorMessage}/>
    </>
    
  );
}
