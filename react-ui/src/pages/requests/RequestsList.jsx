import RequestCard from "./RequestCard";

const RequestsList = ({ requests, onAccept, onReject }) => {
  if (!requests || requests.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 0 40px rgba(8,7,16,0.6)'
      }}>
        <p style={{
          fontSize: '18px',
          color: '#666',
          fontFamily: "'Poppins', sans-serif"
        }}>
          No purchase requests for this book yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      {requests.map((request, idx) => (
        <RequestCard 
          key={idx} 
          request={request} 
          onAccept={onAccept}
          onReject={onReject}
        />
      ))}
    </div>
  );
};

export default RequestsList;
