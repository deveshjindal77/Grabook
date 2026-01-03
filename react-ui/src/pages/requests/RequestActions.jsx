const RequestActions = ({ request, onAccept, onReject }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      alignItems: 'flex-end'
    }}>
      <button
        onClick={() => onAccept && onAccept(request)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: "'Poppins', sans-serif",
          transition: 'background-color 0.3s',
          width: '100%',
          minWidth: '120px'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
      >
        Accept
      </button>
      <button
        onClick={() => onReject && onReject(request)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: "'Poppins', sans-serif",
          transition: 'background-color 0.3s',
          width: '100%',
          minWidth: '120px'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
      >
        Reject
      </button>
    </div>
  );
};

export default RequestActions;

