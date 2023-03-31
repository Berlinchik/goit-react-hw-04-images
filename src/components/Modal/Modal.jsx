import s from './Modal.module.scss';
import usePortal from 'react-useportal';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Modal = ({ closeModal, image, descr }) => {
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('modal-root'),
  });

  useEffect(() => {
    window.addEventListener('keydown', handleCloseModalByEscape);

    return () => {
      window.removeEventListener('keydown', handleCloseModalByEscape);
    };
  });

  const handleCloseModal = e => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleCloseModalByEscape = e => {
    if (e.code === 'Escape') {
      closeModal();
    }
  };

  return (
    <Portal>
      <div className={s.Overlay} onClick={handleCloseModal}>
        <div className={s.Modal}>
          <img src={image} alt={descr} />
        </div>
      </div>
    </Portal>
  );
};

Modal.propTypes = {
  image: PropTypes.string.isRequired,
  descr: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default Modal;
