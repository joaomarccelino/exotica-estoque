import { ReactNode } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

type ModalProps = {
  show: boolean;
  setShow(): void;
  title: string;
  children: ReactNode;
}

export default function ModalComponent({
  show,
  setShow,
  title,
  children,
}: ModalProps) {
  return (
    <Modal show={show} onHide={setShow} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
}
