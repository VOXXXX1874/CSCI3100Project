import React, { useState } from 'react';
import { useConversations } from '../contexts/ConversationsProvider';
import { Form, InputGroup, Button, Container, Row, Col } from 'react-bootstrap'

export default function OpenConversation() {
    const { selectedConversation, sendMessage } = useConversations();
    const [ text, setText ] = useState('')

    function handleSubmit(e){
        e.preventDefault()

        sendMessage(selectedConversation.recipients.map(recipient => recipient.id), text)
        setText('')
    }

    return (
        selectedConversation && (
            <>
               <Container>
                <Col>
                    <Row>
                    <div className="d-flex flex-column align-items-start justify-content-end px-3">
                    {selectedConversation.messages.map((message, index) => {
                    return (
                        <div
                            key={index}
                            className={`my-1 d-flex flex-column" ${message.fromMe ? 'align-self-end': ''}`}
                        >
                        <div 
                            className={`rounded px-2 py-1 ${message.fromMe ? 'bg-primary' : 'border'}`}
                        >
                            {message.text}
                        </div>
                        <div className={`text-muted small ${message.fromMe ? 'text-right': ''}`}>
                            {message.fromMe ? 'You' : message.senderName}
                        </div>
                        </div>
                            );
                        })}
                    </div>

                    </Row>
                    <Row>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="m-2">
                            <InputGroup>
                                <Form.Control
                                    as="textarea" 
                                    required 
                                    value = {text}
                                    onChange = {e => setText(e.target.value)}
                                    style={{height: '75px', resize: 'none'}}
                                />
                                <Button type="submit" variant="outline-secondary" id="button-addon2">
                                    Send
                                </Button>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                    </Row>
                    </Col>
                </Container>
            </>
        )
    );
}
