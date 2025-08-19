import { motion } from 'framer-motion';
type ServerModalProps = {
  isShown: boolean;
  toggleIsShown: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ServerModal({ isShown, toggleIsShown }: ServerModalProps) {

  if (!isShown) return null;

  const handleBtnClose = () => {
    toggleIsShown(false);
  };

  return (
      <motion.div
        className="server-modal-container"
        initial={{ y: '-100vh', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
      >
        <motion.a
          href="https://discord.gg/exAg7g5eH8"
          target="_blank"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <p className="join-txt">https://discord.gg/exAg7g5eH8</p>
        </motion.a>

        <motion.button
          onClick={handleBtnClose}
          className="close-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Close 
        </motion.button>
      </motion.div>
  );
}
