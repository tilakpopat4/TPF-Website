export default function TestPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>VERIFICATION PAGE</h1>
      <p>If you see this, the server IS picking up new files from this directory.</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}
