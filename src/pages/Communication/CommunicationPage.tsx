import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Button, Alert, ListGroup } from 'react-bootstrap';
import api from '../../services/api';
import { useAuth } from '../../components/Context/AuthContext';
import Loading from '../../components/Spinner/Loading';
import NoData from '../../components/NoData/NoData';
import { toast } from 'react-toastify';
import '../SharedStyles.scss';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  service_request_id: number;
  message: string;
  created_at: string;
  sender_email: string;
  receiver_email: string;
}

const CommunicationPage: React.FC = () => {
  const { serviceRequestId } = useParams<{ serviceRequestId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState<number | null>(null);

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['messages', serviceRequestId],
    queryFn: async () => {
      const response = await api.get(`/communication/messages/${serviceRequestId}`);
      return response.data as Message[];
    },
    enabled: !!serviceRequestId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (messageData: { receiverId: number; serviceRequestId: string; message: string }) =>
      api.post('/communication/send', messageData),
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', serviceRequestId] });
      toast.success('Message sent successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to send message');
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage || !receiverId || !serviceRequestId) {
      toast.error('Please enter a message and select a receiver');
      return;
    }

    sendMessageMutation.mutate({
      receiverId,
      serviceRequestId,
      message: newMessage,
    });
  };

  if (isLoading) return <Loading />;
  if (error) {
    toast.error('Failed to load messages');
    return <Alert variant="danger">Failed to load messages</Alert>;
  }

  return (
    <div className="page-container">
      <h2>Messages for Service Request #{serviceRequestId}</h2>
      <ListGroup className="message-list">
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <ListGroup.Item
              key={msg.id}
              className={msg.sender_id === user?.id ? 'text-end bg-light' : 'text-start'}
            >
              <strong>{msg.sender_email}:</strong> {msg.message}
              <br />
              <small>{new Date(msg.created_at).toLocaleString()}</small>
            </ListGroup.Item>
          ))
        ) : (
          <NoData />
        )}
      </ListGroup>
      <Form onSubmit={handleSendMessage} className="form-container">
        <Form.Group className="mb-3">
          <Form.Label>Receiver ID</Form.Label>
          <Form.Control
            type="number"
            value={receiverId || ''}
            onChange={(e) => setReceiverId(parseInt(e.target.value))}
            placeholder="Enter receiver ID"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={sendMessageMutation.isPending}>
          {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
        </Button>
      </Form>
    </div>
  );
};

export default CommunicationPage;