import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default function StartGameModal({ closeModal }) {
  function handleCancel(e) {
    e.preventDefault()
    closeModal()
  }

  return (
    <>
      <Modal.Header closeButton>Please be patient, we are looking for another player...</Modal.Header>
      <Modal.Body>
        <Button onClick={handleCancel}>Cancel Match</Button>
      </Modal.Body>
    </>
  )
}