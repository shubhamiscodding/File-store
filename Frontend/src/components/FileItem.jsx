export default function FileItem({ file }) {
  return (
    <div className="p-4 border rounded shadow">
      <h3>{file.name}</h3>
    </div>
  );
}
